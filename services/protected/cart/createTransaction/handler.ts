import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import {
    Database,
    Checkout,
    Order,
    Transaction,
    TransactionType,
} from '@medii/data';
import { AppError } from '@medii/common';
import { orderGetPayAmount } from '@medii/payment';
import schema from './schema';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPESECRETKEY ?? '', {
    apiVersion: '2020-08-27',
});
const database = new Database();

const validateOrder = (order: Order) => {
    // Validate costs add up as expected
    const shippingCost = order.line_items.find(
        (itm) => itm?.type?.name === 'Shipping'
    )?.price;

    const listingCost = order.line_items.find(
        (itm) => itm?.type?.name === 'Listing'
    )?.price;

    const taxCost = order.line_items.find(
        (itm) => itm?.type?.name === 'Tax'
    )?.price;

    let calculatedTotal =
        Math.round(
            (Number(listingCost) + Number(taxCost) + Number(shippingCost)) * 100
        ) / 100;
    if (Number(calculatedTotal) !== Number(order.total)) {
        console.error(
            `CREATE TRANSACTION| Order [${order.order_number}] does not add up. Expected: [$ ${order.total}] Found: [$ ${calculatedTotal}]`,
            order.total,
            calculatedTotal
        );
        throw new AppError(
            `Order [${order.order_number}] does not add up. Expected: [$ ${order.total}] Found: [$ ${calculatedTotal}]`,
            400
        );
    }

    if (!order.listing.account.stripe_user_id) {
        console.error(
            `CREATE TRANSACTION| Order [${order.order_number}] does not have an attached stripe_user_id.`,
            order.listing.account
        );
        throw new AppError(
            `Order [${order.order_number}] missing critical seller information!`,
            400
        );
    }
};

const task = async (event) => {
    const checkoutId = event.body.checkoutId;
    const orderId = event.body.orderId;
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;
    const currency = 'aud';

    const dbConn = await database.getConnection();
    let paymentIntent;

    // Validation to make sure you are authorized to attach this order

    if (checkoutId) {
        const checkout = await dbConn
            .createQueryBuilder(Checkout, 'checkout')
            .innerJoinAndSelect('checkout.orders', 'order')
            .innerJoinAndSelect('order.line_items', 'li')
            .innerJoinAndSelect('order.listing', 'listing')
            .innerJoinAndSelect('listing.account', 'seller')
            .innerJoinAndSelect('li.type', 'lit')
            .innerJoin('order.buyer', 'buyer')
            .innerJoin('buyer.users', 'u')
            .where('u.cognito_user_id = :userId', {
                userId: userId,
            })
            .andWhere('checkout.id = :checkoutId', {
                checkoutId: checkoutId,
            })
            .getOneOrFail();

        // Validate costs add up as expected
        checkout.orders.map((order) => {
            validateOrder(order);
        });

        const totalToPay = checkout.orders
            .map((order) => {
                return orderGetPayAmount(order);
            })
            .reduce((a, b) => Number(a) + Number(b), 0);

        const payment_transfer_group_id = `CHECKOUT${checkout.id}`;

        console.log('STRIPE| creating payment intent...');
        paymentIntent = await stripe.paymentIntents.create({
            amount: Number((totalToPay * 100).toFixed()),
            currency: currency,
            description: checkout.orders
                .map(
                    (order) =>
                        order.line_items.find(
                            (itm) => itm?.type?.name === 'Listing'
                        )?.title
                )
                .join(', '),
            payment_method_types: ['au_becs_debit', 'card'],
            transfer_group: payment_transfer_group_id,
        });
        console.log('STRIPE| created payment Intent: ', paymentIntent);

        await dbConn.transaction(async (transactionalEntityManager) => {
            let transaction = new Transaction();

            transaction.type = await transactionalEntityManager
                .createQueryBuilder(TransactionType, 'tt')
                .where('tt.name = :transactionType', {
                    transactionType: 'Security Deposit',
                })
                .getOneOrFail();
            transaction.stripe_pi_id = paymentIntent.id;

            console.log('TRANSACTION| Checkout Payment | Creating...');
            checkout.created_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            checkout.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            checkout.transaction = await dbConn
                .getRepository(Transaction)
                .save(transaction);
            await dbConn.getRepository(Checkout).save(checkout);
            console.log('TRANSACTION| Checkout Payment | Created.');
        });
    } else if (orderId) {
        const order = await dbConn
            .createQueryBuilder(Order, 'order')
            .innerJoinAndSelect('order.line_items', 'li')
            .innerJoinAndSelect('order.listing', 'listing')
            .innerJoinAndSelect('listing.account', 'seller')
            .innerJoinAndSelect('li.type', 'lit')
            .innerJoin('order.buyer', 'buyer')
            .innerJoin('buyer.users', 'u')
            .where('u.cognito_user_id = :userId', {
                userId: userId,
            })
            .andWhere('order.id = :orderId', {
                orderId: orderId,
            })
            .getOneOrFail();

        validateOrder(order);

        const totalToPay = orderGetPayAmount(order);

        console.log('STRIPE| creating payment intent...');
        paymentIntent = await stripe.paymentIntents.create({
            amount: Number((totalToPay * 100).toFixed()),
            currency: currency,
            description: order.line_items.find(
                (itm) => itm?.type?.name === 'Listing'
            )?.title,
            payment_method_types: ['au_becs_debit', 'card'],
        });
        console.log('STRIPE| created payment Intent: ', paymentIntent);

        await dbConn.transaction(async (transactionalEntityManager) => {
            let transaction = new Transaction();

            transaction.type = await transactionalEntityManager
                .createQueryBuilder(TransactionType, 'tt')
                .where('tt.name = :transactionType', {
                    transactionType: 'Balance Payment',
                })
                .getOneOrFail();
            transaction.stripe_pi_id = paymentIntent.id;
            transaction.order = order;
            transaction.created_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            transaction.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;

            console.log('TRANSACTION| Checkout Payment | Creating...');
            transaction = await dbConn
                .getRepository(Transaction)
                .save(transaction);
            console.log('TRANSACTION| Checkout Payment | Created.');
        });
    } else {
        console.error(
            `Could not create Transaction, no order/checkout id attached.`
        );
        throw new AppError(
            'Could not create Transaction, no order/checkout attached',
            400
        );
    }

    return paymentIntent;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
