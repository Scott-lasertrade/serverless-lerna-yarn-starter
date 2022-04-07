import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, ListingApprovalsView } from '@medii/data';

const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    const listings = await dbConn
        .createQueryBuilder(ListingApprovalsView, 'lav')
        .orderBy('create_at', 'DESC', 'NULLS LAST')
        .getMany();
    return listings;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main = middyfy(handler);
