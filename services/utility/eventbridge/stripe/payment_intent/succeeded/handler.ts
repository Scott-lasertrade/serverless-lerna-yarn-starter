import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { AppError } from '@medii/common';
import { handleTimeout } from '@medii/api-lambda';
import {
    Database,
    Listing,
    ListingStatus,
    OrderStatus,
    Order,
    Transaction,
    Account,
    CartItem,
} from '@medii/data';
import { sendToEventBridge } from '@medii/eventbridge';
import { orderGetPayAmount, orderGetApplicationFee } from '@medii/payment';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPESECRETKEY ?? '', {
    apiVersion: '2020-08-27',
});
const database = new Database();

const payOrder = async (transactionalEntityManager, order, amount) => {
    order.paid = Number(order.paid) + Number(amount);
    if (Number(order.paid) >= Number(order.total)) {
        order.status = await transactionalEntityManager
            .createQueryBuilder(OrderStatus, 'os')
            .where('os.name = :draftStatus', {
                draftStatus: 'Paid',
            })
            .getOneOrFail();
    } else {
        order.status = await transactionalEntityManager
            .createQueryBuilder(OrderStatus, 'os')
            .where('os.name = :draftStatus', {
                draftStatus: 'Deposit Made',
            })
            .getOneOrFail();
    }
    console.log('ORDER| Update Status...', order);
    await transactionalEntityManager.getRepository(Order).save(order);
    console.log('ORDER| Updated.');
};

const task: any = async (event) => {
    console.log(`STRIPE| SUCCESS - PI[${event?.detail?.data?.object?.id}]...`);
    const dbConn = await database.getConnection();
    let relatedListings: Listing[] = [];
    let emailParams: {
        id?: string;
        type?: string;
        paymentSecret?: string;
        accountId?: number;
    } = {};

    if (!event?.detail?.data?.object?.id) {
        throw new AppError('Recieved bad payment intent', 400);
    }

    const transaction = await dbConn
        .createQueryBuilder(Transaction, 't')
        .innerJoinAndSelect('t.type', 'tt')
        .leftJoinAndSelect('t.order', 'order')
        .leftJoinAndSelect('order.buyer', 'orderBuyer')
        .leftJoinAndSelect(
            't.checkout',
            'checkout',
            'checkout."transactionId" = t.id'
        )
        .where('t.stripe_pi_id = :transactionId', {
            transactionId: event.detail.data.object.id,
        })
        .getOneOrFail();

    console.log('STRIPE| SUCCESS, Found transaction', transaction);

    if (transaction.checkout && transaction.order) {
        console.error(
            `STRIPE| SUCCESS, Transaction[${transaction.id}]: In bad state, attached to both order[${transaction.order.id}] AND checkout[${transaction.checkout.id}]`
        );
        throw new AppError('Transaction tied to order and transaction', 400);
    }

    await dbConn.transaction(async (transactionalEntityManager) => {
        if (transaction.checkout) {
            console.log('STRIPE| SUCCESS, Type Checkout', transaction.checkout);
            relatedListings = await transactionalEntityManager
                .createQueryBuilder(Listing, 'l')
                .innerJoinAndSelect('l.orders', 'ord')
                .innerJoin('ord.checkout', 'checkout')
                .innerJoin('checkout.transaction', 't')
                .where('t.id = :transactionId', {
                    transactionId: transaction.id,
                })
                .getMany();

            const relatedAccounts = await transactionalEntityManager
                .createQueryBuilder(Account, 'a')
                .innerJoin('a.orders_bought', 'ord')
                .innerJoin('ord.checkout', 'checkout')
                .innerJoin('checkout.transaction', 't')
                .where('t.id = :transactionId', {
                    transactionId: transaction.id,
                })
                .getMany();

            if (relatedAccounts?.length > 0) {
                console.log('MY EVENT IS', event);
                console.log('MY DATA IS', event.detail.data);
                emailParams = {
                    id: event.detail.data.object.id,
                    type: 'payment_success',
                    paymentSecret: event.stripePaymentSecret,
                    accountId: relatedAccounts[0].id ?? 0,
                };
            } else {
                console.error(
                    `Transaction[${transaction.id}]: Failed to send email, could not find related account`
                );
                throw new AppError('Transaction failed to send email', 400);
            }

            const relatedOrders = await transactionalEntityManager
                .createQueryBuilder(Order, 'o')
                .innerJoinAndSelect('o.listing', 'l')
                .innerJoinAndSelect('l.account', 'seller')
                .innerJoinAndSelect('o.checkout', 'checkout')
                .where('checkout.id = :checkoutId', {
                    checkoutId: transaction.checkout.id,
                })
                .getMany();

            if (relatedOrders?.length > 0) {
                const totalToPayOut = relatedOrders
                    .map((order) => {
                        return orderGetPayAmount(order);
                    })
                    .reduce((a, b) => Number(a) + Number(b), 0);

                if (
                    Number(totalToPayOut * 100) !==
                    Number(event.detail.data.object.amount)
                ) {
                    console.error(
                        `Payout failed, Expected: [${Number(
                            totalToPayOut
                        )}], Actual: [${Number(
                            (event.detail.data.object.amount / 100).toFixed(2)
                        )}]`
                    );
                    throw new AppError(
                        'Payout failed, expected payout does not match actual.',
                        400
                    );
                }

                // TODO: S.Y - Amount should be less our charges
                const payment_transfer_group_id = `CHECKOUT${transaction.checkout.id}`;
                await Promise.all(
                    relatedOrders.map(async (order) => {
                        console.log(
                            `Creating transfer for order[${
                                order.id
                            }] [$${orderGetPayAmount(
                                order
                            )}] - [$${orderGetApplicationFee(order)}] = $${
                                orderGetPayAmount(order) -
                                orderGetApplicationFee(order)
                            }`
                        );
                        const charges = await stripe.charges.list({
                            transfer_group: payment_transfer_group_id,
                        });
                        console.log(charges);
                        // Create a Transfer to the connected account (later):
                        const transfer = await stripe.transfers.create({
                            amount:
                                Number(orderGetPayAmount(order) * 100) -
                                Number(orderGetApplicationFee(order) * 100),
                            currency: 'aud',
                            destination: order.listing.account.stripe_user_id,
                            transfer_group: payment_transfer_group_id,
                            source_transaction: charges?.data?.[0].id,
                        });
                        console.log(transfer);
                        await payOrder(
                            transactionalEntityManager,
                            order,
                            orderGetPayAmount(order)
                        );
                    })
                );
            } else {
                console.error(
                    `Checkout[${transaction.checkout.id}]: Has no orders attached`
                );
                throw new AppError(
                    'Transaction failed, no orders found for checkout.',
                    400
                );
            }
        } else if (transaction.order) {
            console.log('STRIPE| SUCCESS, Type Order', transaction.order);
            relatedListings = await transactionalEntityManager
                .createQueryBuilder(Listing, 'l')
                .innerJoinAndSelect('l.orders', 'ord')
                .innerJoin('ord.transactions', 't')
                .where('t.id = :transactionId', {
                    transactionId: transaction.id,
                })
                .getMany();

            emailParams = {
                id: event.transactionId,
                type: 'payment_success',
                paymentSecret: event.stripePaymentSecret,
                accountId: transaction.order.buyer.id ?? 0,
            };

            const order = transaction.order;
            if (
                Number(orderGetPayAmount(order) * 100) !==
                Number(event.detail.data.object.amount)
            ) {
                console.error(
                    `Payout failed, Expected: [${Number(
                        orderGetPayAmount(order)
                    )}], Actual: [${Number(
                        (event.detail.data.object.amount / 100).toFixed(2)
                    )}]`
                );
                throw new AppError(
                    'Payout failed, expected payout does not match actual.',
                    400
                );
            }

            console.log(
                `Creating transfer for order[${order.id}] [$${orderGetPayAmount(
                    order
                )}] - [$${orderGetApplicationFee(order)}] = $${
                    orderGetPayAmount(order) - orderGetApplicationFee(order)
                }`
            );
            const charges = await stripe.charges.list({
                payment_intent: transaction.stripe_pi_id,
            });

            // Create a Transfer to the connected account (later):
            await stripe.transfers.create({
                amount:
                    Number(orderGetPayAmount(order) * 100) -
                    Number(orderGetApplicationFee(order) * 100),
                currency: 'aud',
                destination: order.buyer.stripe_user_id,
                source_transaction: charges?.data?.[0].id,
            });
            await payOrder(
                transactionalEntityManager,
                order,
                orderGetPayAmount(order)
            );
        } else {
            console.error(
                `Transaction[${transaction.id}]: In a null state, attached to nothing.`
            );
            throw new AppError('Transaction tied at invalid state', 400);
        }

        const soldStatus = await transactionalEntityManager
            .createQueryBuilder(ListingStatus, 'ls')
            .where('ls.name = :status', {
                status: 'Sold',
            })
            .getOneOrFail();

        const pendingStatus = await transactionalEntityManager
            .createQueryBuilder(ListingStatus, 'ls')
            .where('ls.name = :status', {
                status: 'Pending Sale',
            })
            .getOneOrFail();

        if (relatedListings?.length > 0) {
            relatedListings.map((listing) => {
                if (listing.orders?.length > 0) {
                    if (
                        listing.orders
                            .map((order) => order.paid)
                            .reduce((a, b) => Number(a) + Number(b), 0) >=
                        listing.orders
                            .map((order) => order.total)
                            .reduce((a, b) => Number(a) + Number(b), 0)
                    ) {
                        listing.listing_status = soldStatus;
                    } else {
                        console.log(
                            `LISTING [${
                                listing.id
                            }] - Not fully paid. PAID: [$${listing.orders
                                .map((order) => order.paid)
                                .reduce(
                                    (a, b) => Number(a) + Number(b),
                                    0
                                )}] TOTAL: [$${listing.orders
                                .map((order) => order.total)
                                .reduce((a, b) => Number(a) + Number(b), 0)}]`
                        );
                        listing.listing_status = pendingStatus;
                    }
                } else {
                    console.error(
                        `Listing[${listing.id}] - Has no attached orders`
                    );
                    throw new AppError('Listing missing order details...', 400);
                }
            });

            // Remove from everyones carts
            const cartItemsToDelete = await transactionalEntityManager
                .createQueryBuilder(CartItem, 'cart')
                .innerJoinAndSelect('cart.listing', 'listing')
                .where('listing.id in(:...ids)', {
                    ids: relatedListings.map((l) => l.id),
                })
                .getMany();

            if (cartItemsToDelete?.length > 0) {
                await transactionalEntityManager
                    .getRepository(CartItem)
                    .remove(cartItemsToDelete);
            }
        }

        console.log('LISTINGS| Update Listing Status...', relatedListings);
        await transactionalEntityManager
            .getRepository(Listing)
            .save(relatedListings);
        console.log('LISTINGS| Updated.');

        console.log('TRANSACTION| Update Status...', transaction);
        await transactionalEntityManager
            .getRepository(Transaction)
            .save(transaction);
        console.log('TRANSACTION| Updated.');
    });

    // S.Y. Refresh listings if any were updated
    if (relatedListings?.length > 0) {
        let params;
        try {
            params = {
                id: 'payment_succeeded',
                type: 'refresh_listings',
            };
            console.log(`EVENT BRIDGE| Starting...`, params);
            await sendToEventBridge(
                process.env.EVENT_BRIDGE ?? '',
                params,
                process.env.STAGE ?? ''
            );
        } catch (err) {
            if (err instanceof Error) {
                console.error(`EVENT BRIDGE| Error: ${err.message}`);
                throw new AppError(`EVENT BRIDGE| Error: ${err.message}`, 400);
            } else {
                console.error(`EVENT BRIDGE| Unexpected Error: ${err}`);
                throw new AppError(
                    `EVENT BRIDGE| Unexpected Error: ${err}`,
                    400
                );
            }
        }
    }

    try {
        console.log(`EVENT BRIDGE| Starting...`, emailParams);
        await sendToEventBridge(
            process.env.EVENT_BRIDGE_EMAIL ?? '',
            emailParams,
            process.env.STAGE ?? ''
        );
    } catch (err) {
        if (err instanceof Error) {
            console.error(`EVENT BRIDGE| Error: ${err.message}`);
            throw new AppError(`EVENT BRIDGE| Error: ${err.message}`, 400);
        } else {
            console.error(`EVENT BRIDGE| Unexpected Error: ${err}`);
            throw new AppError(`EVENT BRIDGE| Unexpected Error: ${err}`, 400);
        }
    }

    const response = {
        statusCode: 200,
    };
    return response;
};

export const main = async (event, context) => {
    try {
        console.log(event);
        return await handleTimeout(task(event, context), context);
    } catch (e) {
        if (e instanceof Error) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: e.message ? e.message : e,
                }),
            };
        } else {
            return {
                statusCode: 400,
                body: e,
            };
        }
    }
};
