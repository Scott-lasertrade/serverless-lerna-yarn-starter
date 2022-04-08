import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Order } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.id)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const id = Number(event.pathParameters.id);

    const dbConn = await database.getConnection();

    const order = await dbConn
        .createQueryBuilder(Order, 'order')
        .innerJoinAndSelect('order.checkout', 'checkout')
        .leftJoinAndSelect('checkout.buyer_details', 'buyer_details')
        .leftJoinAndSelect('order.buyer', 'buyerAccount')
        .leftJoinAndSelect('buyer_details.address', 'addr')
        .leftJoinAndSelect('addr.country', 'c')
        .leftJoinAndSelect('order.line_items', 'li')
        .leftJoinAndSelect('li.type', 'lit')
        .leftJoinAndSelect('order.status', 'order_status')
        .leftJoinAndSelect('order.listing', 'listing')
        .leftJoinAndSelect('listing.address', 'laddr')
        .leftJoinAndSelect('laddr.country', 'lc')
        .leftJoinAndSelect('listing.listing_images', 'listing_images')
        .leftJoinAndSelect('listing.product', 'product')
        .leftJoinAndSelect('product.manufacturers', 'manufacturer')
        .leftJoinAndSelect('listing.account', 'seller')
        .leftJoinAndSelect('order.history', 'oh')
        .leftJoinAndSelect('oh.status', 'ohs')
        .where('order.id = :id', { id: id })
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
