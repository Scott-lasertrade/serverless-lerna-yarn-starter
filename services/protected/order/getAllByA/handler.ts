import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Order } from '@medii/data';
import schema from './schema';
const database = new Database();

const task = async (event) => {
    const dbConn = await database.getConnection();
    const buyerId = event.body.buyerId;

    const order = await dbConn
        .createQueryBuilder(Order, 'o')
        .innerJoinAndSelect('o.listing', 'l')
        .innerJoinAndSelect('l.product', 'lp')
        .leftJoinAndSelect('lp.product_images', 'lpi')
        .leftJoinAndSelect('l.listing_images', 'li')
        .leftJoinAndSelect('o.buyer', 'b')
        .where('b.id = :buyerId', {
            buyerId: buyerId,
        })
        .getMany();

    return order;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
