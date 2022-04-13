import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    // LISTING
    if (!Number(event.pathParameters?.lid)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters?.lid}`,
            400
        );
    }
    const lid = Number(event.pathParameters?.lid);
    const version = event.body.version;

    const dbConn = await database.getConnection();
    let deleteListing: Listing;
    let deletedListing = new Listing();
    await dbConn.transaction(async (transactionalEntityManager) => {
        deleteListing = await transactionalEntityManager
            .getRepository(Listing)
            .findOneOrFail(lid);
        deleteListing.version = version;
        deletedListing = await transactionalEntityManager.softRemove(
            deleteListing
        );
    });
    return deletedListing;
};
const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
