import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { AppError } from '@medii/common';
import { handleTimeout } from '@medii/api-lambda';
import { Database, Listing, Transaction, Account } from '@medii/data';
import { sendToEventBridge } from '@medii/eventbridge';

const database = new Database();

const task: any = async (event) => {
    console.log(event);
    console.log(`STRIPE| FAILED - PI[${event?.detail?.data?.object?.id}]...`);
    let dbConn = await database.getConnection();
    let relatedListings = new Listing[];
    let emailParams: {
        id: string;
        type: string;
        paymentSecret: string;
        accountId: number;
    };

    let transaction = await dbConn
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

    console.log('STRIPE| FAILED, Found transaction', transaction);

    if (transaction.checkout && transaction.order) {
        console.error(
            `Transaction[${transaction.id}]: In bad state, attached to both order[${transaction.order.id}] AND checkout[${transaction.checkout.id}]`
        );
        throw new AppError('Transaction tied to order and transaction', 400);
    }

    if (transaction.checkout) {
        console.log('STRIPE| FAILED, Type Checkout', transaction.checkout);
        relatedListings = await dbConn
            .createQueryBuilder(Listing, 'l')
            .innerJoin('l.orders', 'ord')
            .innerJoin('ord.checkout', 'checkout')
            .innerJoin('checkout.transaction', 't')
            .where('t.id = :transactionId', {
                transactionId: transaction.id,
            })
            .getMany();

        let relatedAccounts = await dbConn
            .createQueryBuilder(Account, 'a')
            .innerJoin('a.orders_bought', 'ord')
            .innerJoin('ord.checkout', 'checkout')
            .innerJoin('checkout.transaction', 't')
            .where('t.id = :transactionId', {
                transactionId: transaction.id,
            })
            .getMany();

        if (relatedAccounts?.length > 0) {
            emailParams = {
                id: event.detail.data.object.id,
                type: 'payment_failed',
                paymentSecret: event.detail.data.object.client_secret,
                accountId: relatedAccounts[0]?.id ?? 0,
            };
        } else {
            console.error(
                `Transaction[${transaction.id}]: Failed to send email, could not find related account`
            );
            throw new AppError('Transaction failed to send email', 400);
        }
    } else if (transaction.order) {
        console.log('STRIPE| FAILED, Type Order', transaction.order);
        if (
            Number(Number(transaction.order.paid ?? 0).toFixed(2)) ===
            Number((0).toFixed(2))
        ) {
            relatedListings = await dbConn
                .createQueryBuilder(Listing, 'l')
                .innerJoin('l.orders', 'ord')
                .innerJoin('ord.transactions', 't')
                .where('t.id = :transactionId', {
                    transactionId: transaction.id,
                })
                .getMany();
        }

        emailParams = {
            id: event.detail.data.object.id,
            type: 'balance_payment_failed',
            paymentSecret: event.detail.data.object.client_secret,
            accountId: transaction.order.buyer.id ?? 0,
        };
    } else {
        console.error(
            `Transaction[${transaction.id}]: In a null state, attached to nothing.`
        );
        throw new AppError('Transaction tied at invalid state', 400);
    }

    // S.Y. If the order has not had any prior payments this will be populated
    if (relatedListings?.length > 0) {
        const params = {
            id: 'payment_failed',
            type: 'reinstate_listings',
            listings: relatedListings,
            transactionId: event.detail.data.object.id,
        };
        try {
            console.log(`EVENT BRIDGE| Starting...`, params);
            await sendToEventBridge(
                process.env.EVENT_BRIDGE_STATEMACHINE,
                params,
                process.env.STAGE
            );
        } catch (err: any) {
            console.error(`EVENT BRIDGE| Error: ${err.message}`);
            throw new AppError(`EVENT BRIDGE| Error: ${err.message}`, 400);
        }
    }

    try {
        console.log(`EVENT BRIDGE| Starting...`, emailParams);
        await sendToEventBridge(
            process.env.EVENT_BRIDGE_EMAIL ?? '',
            emailParams,
            process.env.STAGE ?? ''
        );
    } catch (err: any) {
        console.error(`EVENT BRIDGE| Error: ${err.message}`);
        throw new AppError(`EVENT BRIDGE| Error: ${err.message}`, 400);
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
    } catch (e: any) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: e.message ? e.message : e,
            }),
        };
    }
};
