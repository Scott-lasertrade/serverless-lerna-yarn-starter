import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Order } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    const dbConn = await database.getConnection();
    const buyerId = event.headers.CurrentUserId ?? event.headers.currentuserid;
    if (!Number(event.pathParameters.oId)) {
        throw new AppError(
            `Incorrect ids format provided - ${event.pathParameters.oId}`,
            400
        );
    }
    const orderId = Number(event.pathParameters.oId);

    const order = await dbConn
        .createQueryBuilder(Order, 'o')
        .innerJoin('o.buyer', 'bacc')
        .innerJoin('bacc.users', 'u')
        .leftJoinAndSelect('o.offer', 'offer')
        .leftJoinAndSelect('o.line_items', 'li')
        .leftJoinAndSelect('li.type', 'lit')
        .leftJoinAndSelect('o.buyer_details', 'buyer')
        .leftJoinAndSelect('buyer.address', 'add')
        .leftJoinAndSelect('add.country', 'c')
        .leftJoinAndSelect('o.listings', 'l')
        .leftJoinAndSelect('l.product', 'p')
        .leftJoinAndSelect('p.product_images', 'pimg')
        .leftJoinAndSelect('l.listing_images', 'limg')
        .leftJoinAndSelect('l.listing_accessories', 'lacc')
        .leftJoinAndSelect('lacc.product', 'pacc')
        .leftJoinAndSelect('pacc.product_images', 'paccimg')
        .where('u.cognito_user_id = :buyerId', {
            buyerId: buyerId,
        })
        .andWhere('o.id = :orderId', { orderId: orderId })
        .getOneOrFail();
    return order;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
