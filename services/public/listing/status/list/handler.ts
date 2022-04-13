import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, ListingStatus } from '@medii/data';

const database = new Database();

const task = async (event) => {
    const dbConn = await database.getConnection();
    const listingStatuses = await dbConn
        .createQueryBuilder(ListingStatus, 'listing')
        .getMany();
    return listingStatuses;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
