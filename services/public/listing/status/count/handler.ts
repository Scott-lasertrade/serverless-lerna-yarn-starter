import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing } from '@medii/data';

const database = new Database();

const task = async (event) => {
    const { statusName } = event.pathParameters;
    console.log('Checking Statuses', decodeURI(statusName));

    const dbConn = await database.getConnection();
    const countListings = await dbConn
        .createQueryBuilder(Listing, 'listing')
        .innerJoinAndSelect('listing.product', 'p')
        .innerJoinAndSelect('listing.listing_status', 'ls')
        .where('ls.name = :status', {
            status: decodeURI(statusName),
        })
        .getCount();
    return countListings;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
