import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Watchlist } from '@medii/data';
import { AppError } from '@medii/common';

enum WatchStatus {
    Unwatched = 0,
    Watching = 1,
    Offer = 2,
}

const database = new Database();

const task = async (event) => {
    const aId = Number(event.pathParameters.aId);
    const lId = Number(event.pathParameters.lId);
    if (!Number(lId) || !Number(aId)) {
        throw new AppError(
            `Incorrect id(s) format provided - ${lId} | ${aId}`,
            400
        );
    }

    const dbConn = await database.getConnection();
    const watchlist = await dbConn
        .createQueryBuilder(Watchlist, 'w')
        .innerJoinAndSelect('w.account', 'a')
        .leftJoinAndSelect('w.listing', 'l')
        .where('w.accountId = :accountId', {
            accountId: aId,
        })
        .andWhere('w.listingId = :listingId', {
            listingId: lId,
        })
        .getOne();
    if (!watchlist) {
        return WatchStatus.Unwatched;
    } else return WatchStatus.Watching;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
