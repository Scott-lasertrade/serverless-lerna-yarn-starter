import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Watchlist } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    const lId = event.pathParameters.lId;
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;
    if (!Number(lId)) {
        throw new AppError(`Incorrect id(s) format provided - ${lId}`, 400);
    }

    const dbConn = await database.getConnection();
    const watchlist = await dbConn
        .createQueryBuilder(Watchlist, 'w')
        .innerJoinAndSelect('w.account', 'a')
        .innerJoin('a.users', 'u')
        .innerJoinAndSelect('w.listing', 'l')
        .where('u.cognito_user_id = :userId', {
            userId: userId,
        })
        .andWhere('l.id = :listingId', {
            listingId: lId,
        })
        .getOne();
    if (!watchlist) {
        // S.Y - Probably should return a 204
        return 'No Matching Watchlist';
    }
    return watchlist;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
