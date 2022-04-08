import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Transaction, Listing } from '@medii/data';
import { AppError } from '@medii/common';
import schema from './schema';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPESECRETKEY ?? '', {
    apiVersion: '2020-08-27',
});
const database = new Database();

const task = async (event) => {
    const checkoutId = event.body.checkoutId;

    const dbConn = await database.getConnection();
    await dbConn.transaction(async (transactionalEntityManager) => {
        const getAttachedListings = await transactionalEntityManager
            .createQueryBuilder(Listing, 'listing')
            .innerJoinAndSelect('listing.orders', 'order')
            .innerJoinAndSelect('order.checkout', 'checkout')
            .innerJoinAndSelect('checkout.transaction', 'transaction')
            .where('checkout.id = :checkoutId', {
                checkoutId: checkoutId,
            })
            .getMany();

        const existingTransactions = await transactionalEntityManager
            .createQueryBuilder(Transaction, 'transaction')
            .leftJoinAndSelect('transaction.checkout', 'checkout')
            .innerJoinAndSelect('checkout.orders', 'order')
            .innerJoinAndSelect('order.listing', 'listing')
            .where('checkout.id != :checkoutId', {
                checkoutId: checkoutId,
            })
            .andWhere('listing.id in(:...ids)', {
                ids: getAttachedListings.map((l) => l.id),
            })
            .getMany();

        if (existingTransactions?.length > 0) {
            await Promise.all(
                existingTransactions.map(async (transaction) => {
                    if (!transaction.stripe_pi_id) {
                        console.error(
                            `UNATTACHED TRANSACTION - [${transaction.id}]`
                        );
                        return;
                    }
                    const paymentIntent = await stripe.paymentIntents.retrieve(
                        transaction.stripe_pi_id
                    );

                    let refundedCharges = true;
                    paymentIntent.charges.data.map((charge) => {
                        if (!charge.refunded) {
                            refundedCharges = false;
                        }
                    });
                    if (!refundedCharges) {
                        if (
                            paymentIntent.status === 'processing' ||
                            paymentIntent.status === 'requires_action'
                        ) {
                            throw new AppError(
                                'Someone else is trying to purchase this item, if they fail to complete their payment you may try again later.',
                                400
                            );
                        } else if (paymentIntent.status === 'succeeded') {
                            throw new AppError(
                                'Sorry someone else has to purchased this product.',
                                400
                            );
                        }
                    } else {
                        console.log(
                            `Charges were refunded for payment [${transaction.stripe_pi_id}]`
                        );
                    }
                })
            );
        }
    });
    return { validatedCheckout: checkoutId };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
