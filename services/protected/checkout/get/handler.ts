import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Checkout } from '@medii/data';
import { AppError } from '@medii/common';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const checkoutId = event.body.checkoutId;
    const orderId = event.body.orderId;
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;

    const dbConn = await database.getConnection();
    let checkout: Checkout = new Checkout();

    await dbConn.transaction(async (transactionalEntityManager) => {
        if (checkoutId) {
            checkout = await transactionalEntityManager
                .createQueryBuilder(Checkout, 'checkout')
                .innerJoinAndSelect('checkout.orders', 'order')
                .innerJoinAndSelect('checkout.buyer_details', 'buyer_deets')
                .innerJoinAndSelect('buyer_deets.address', 'add')
                .innerJoinAndSelect('add.country', 'c')
                .innerJoinAndSelect('order.listing', 'l')
                .leftJoinAndSelect('order.line_items', 'line_item')
                .leftJoinAndSelect('line_item.type', 'line_item_type')
                .innerJoinAndSelect('l.product', 'p')
                .innerJoinAndSelect('p.manufacturers', 'm')
                .leftJoinAndSelect('l.listing_images', 'li')
                .leftJoinAndSelect('l.listing_accessories', 'lacc')
                .leftJoinAndSelect('lacc.product', 'pacc')
                .leftJoinAndSelect('pacc.product_images', 'paccimg')
                .innerJoinAndSelect('order.buyer', 'buyer')
                .innerJoinAndSelect('buyer.users', 'u')
                .leftJoinAndSelect('checkout.transaction', 'transaction')
                .where('u.cognito_user_id = :userId', { userId: userId })
                .andWhere('checkout.id = :checkoutId', {
                    checkoutId: checkoutId,
                })
                .getOneOrFail();
        } else if (orderId) {
            checkout = await transactionalEntityManager
                .createQueryBuilder(Checkout, 'checkout')
                .innerJoinAndSelect('checkout.orders', 'order')
                .innerJoinAndSelect('checkout.buyer_details', 'buyer_deets')
                .innerJoinAndSelect('buyer_deets.address', 'add')
                .innerJoinAndSelect('add.country', 'c')
                .innerJoinAndSelect('order.listing', 'l')
                .leftJoinAndSelect('order.line_items', 'line_item')
                .leftJoinAndSelect('line_item.type', 'line_item_type')
                .innerJoinAndSelect('l.product', 'p')
                .innerJoinAndSelect('p.manufacturers', 'm')
                .leftJoinAndSelect('l.listing_images', 'li')
                .leftJoinAndSelect('l.listing_accessories', 'lacc')
                .leftJoinAndSelect('lacc.product', 'pacc')
                .leftJoinAndSelect('pacc.product_images', 'paccimg')
                .innerJoinAndSelect('order.buyer', 'buyer')
                .innerJoinAndSelect('buyer.users', 'u')
                .leftJoinAndSelect('checkout.transaction', 'transaction')
                .where('u.cognito_user_id = :userId', { userId: userId })
                .andWhere('order.id = :orderId', { orderId: orderId })
                .getOneOrFail();
        } else {
            throw new AppError('No id provided to pull checkout from', 400);
        }
    });
    return checkout;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
