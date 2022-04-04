import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { AppError } from '@medii/common';
import { Database, Order } from '@medii/data';
import { Connection } from 'typeorm';
import schema from './schema';
const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.id)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const accountId = Number(event.pathParameters.id);

    const dbConn: Connection = await database.getConnection();

    const orders = await dbConn
        .createQueryBuilder(Order, 'orders_made')
        .innerJoinAndSelect('orders_made.buyer', 'account')
        .leftJoinAndSelect('orders_made.status', 'orders_made_status')
        .leftJoinAndSelect('orders_made.listing', 'orders_made_listing')
        .leftJoinAndSelect('orders_made_listing.product', 'orders_made_product')
        .leftJoinAndSelect(
            'orders_made_product.manufacturers',
            'orders_made_manufacturer'
        )
        .leftJoinAndSelect('orders_made_listing.account', 'sellerAccount')
        .where('account.id = :id', { id: accountId })
        .getMany();

    if (orders?.length > 0) {
        return orders;
    }
    return { statusCode: 204 };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
