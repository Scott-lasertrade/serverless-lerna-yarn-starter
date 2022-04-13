// import type { ValidatedEventAPIGatewayProxyEvent } from '@shared/apiGateway';
// import Database from '@shared/database';
import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { AppError } from '@medii/common';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing } from '@medii/data';
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

    const dbConn = await database.getConnection();

    const listings = await dbConn
        .createQueryBuilder(Listing, 'listings')
        .innerJoin('listings.account', 'acc')
        .leftJoinAndSelect('listings.product', 'prod')
        .leftJoinAndSelect('prod.manufacturers', 'man')
        .leftJoinAndSelect('listings.listing_status', 'ls')
        .where('acc.id = :id', { id: accountId })
        .getMany();

    if (listings?.length > 0) {
        return listings;
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

export const main: any = middyfy(handler);
