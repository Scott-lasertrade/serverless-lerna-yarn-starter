import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Watchlist } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;
    if (!Number(event.pathParameters.id)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const listingId = Number(event.pathParameters.id);

    const dbConn = await database.getConnection();
    let new_watchlist: Watchlist | undefined;

    await dbConn.transaction(async (transactionalEntityManager) => {
        const watchlist = await dbConn
            .createQueryBuilder(Watchlist, 'w')
            .innerJoinAndSelect('w.account', 'a')
            .innerJoin('a.users', 'u')
            .leftJoinAndSelect('w.listing', 'l')
            .where('u.cognito_user_id = :userId', {
                userId: userId,
            })
            .andWhere('w.listingId = :listingId', {
                listingId: listingId,
            })
            .getOneOrFail();
        console.log(`Removing Watchlist`);
        console.log(`listing ID: ${listingId}`);
        console.log(`user ID: ${userId}`);
        console.log(watchlist);

        if (watchlist) {
            watchlist.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            new_watchlist = await transactionalEntityManager
                .getRepository(Watchlist)
                .softRemove(watchlist);
        }
    });

    return {
        new_watchlist,
    };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
