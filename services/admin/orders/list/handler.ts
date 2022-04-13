import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Order } from '@medii/data';

const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    const orders = await dbConn
        .createQueryBuilder(Order, 'order')
        .innerJoinAndSelect('order.checkout', 'checkout')
        .leftJoinAndSelect('checkout.buyer_details', 'buyer_details')
        .leftJoinAndSelect('order.buyer', 'buyerAccount')
        .leftJoinAndSelect('order.status', 'order_status')
        .leftJoinAndSelect('order.listing', 'order_listing')
        .leftJoinAndSelect('order_listing.product', 'order_product')
        .leftJoinAndSelect('order_product.manufacturers', 'order_manufacturer')
        .innerJoinAndSelect('order_listing.account', 'seller')
        .getMany();

    if (orders?.length > 0) {
        return orders;
    }
    return { statusCode: 204 };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main: any = middyfy(handler);
