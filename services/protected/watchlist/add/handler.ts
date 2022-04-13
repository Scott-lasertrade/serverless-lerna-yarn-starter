import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing, Account, Watchlist } from '@medii/data';
import { AppError } from '@medii/common';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;
    const account_id = event.body.account_id;
    const listing_id = event.body.listing_id;

    const dbConn = await database.getConnection();
    let new_watchlist: Watchlist | undefined;

    await dbConn.transaction(async (transactionalEntityManager) => {
        let watchlist: Watchlist;

        watchlist = new Watchlist();
        watchlist.account = (await transactionalEntityManager
            .createQueryBuilder(Account, 'a')
            .innerJoin('a.users', 'u')
            .where('a.id = :accountId', { accountId: account_id })
            .andWhere('u.cognito_user_id = :userId', { userId: userId })
            .getOne()) as Account;
        if (!watchlist.account) {
            throw new AppError('Mismatch between acount and user', 401);
        }

        watchlist.listing = await transactionalEntityManager
            .getRepository(Listing)
            .findOneOrFail(listing_id);
        watchlist.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        watchlist.created_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        await transactionalEntityManager
            .getRepository(Watchlist)
            .save(watchlist);
    });

    return {
        watchlist: new_watchlist,
    };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
