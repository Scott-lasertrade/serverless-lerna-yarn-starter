import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, OrderStatus } from '@medii/data';

const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    const orderStatuses = await dbConn
        .createQueryBuilder(OrderStatus, 'order_statuses')
        .getMany();
    return orderStatuses;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main = middyfy(handler);
