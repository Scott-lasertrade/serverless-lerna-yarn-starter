import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, User, Account, UserLoginHistory } from '@medii/data';
import { addHSContact } from '@medii/hubspot';
import schema from './schema';

const database = new Database();

const saveHistory = async (transactionalEntityManager: any, user: User) => {
    const newLoginHistory = new UserLoginHistory();
    newLoginHistory.date = new Date();
    newLoginHistory.user = user;
    await transactionalEntityManager
        .getRepository(UserLoginHistory)
        .save(newLoginHistory);
};

const task = async (event) => {
    const cogUserId =
        event.headers.CurrentUserId ?? event.headers.currentuserid;

    const dbConn = await database.getConnection();
    let user = await dbConn
        .createQueryBuilder(User, 'u')
        .where('u.cognito_user_id = :cogId', {
            cogId: cogUserId,
        })
        .getOne();

    await dbConn.transaction(async (transactionalEntityManager) => {
        if (user) {
            await saveHistory(transactionalEntityManager, user);
            return { user };
        }

        let newUser = new User();
        newUser.cognito_user_id = cogUserId;
        newUser.hubspot_user_id = await addHSContact(
            event.body.emailAddress,
            event.body.firstName
        );
        newUser.created_by = cogUserId;
        newUser.updated_by = cogUserId;

        user = await transactionalEntityManager
            .getRepository(User)
            .save(newUser);
        await saveHistory(transactionalEntityManager, user);
        let account = new Account();
        account.users = [user];
        account.updated_by = cogUserId;
        account.created_by = cogUserId;
        await transactionalEntityManager.getRepository(Account).save(account);
    });

    return { user };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
