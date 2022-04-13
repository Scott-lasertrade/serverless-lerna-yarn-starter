import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Account } from '@medii/data';
import {
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    ListUsersCommandInput,
    ListUsersCommand,
    AttributeType,
    UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import schema from './schema';

const database = new Database();

const getAttribute = (
    AttributeList: AttributeType[],
    attributeName: string
) => {
    return AttributeList?.length > 0
        ? AttributeList.find((attr) => attr.Name === attributeName)?.Value ??
              null
        : null;
};

const task = async () => {
    const dbConn = await database.getConnection();

    const config: CognitoIdentityProviderClientConfig = {
        region: 'ap-southeast-2',
    };
    const client = new CognitoIdentityProviderClient(config);

    const listUsersInput: ListUsersCommandInput = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
    };
    const listUsersCommand = new ListUsersCommand(listUsersInput);
    const listOfUsers = (await client.send(listUsersCommand)).Users ?? [];

    const dbAccounts = await dbConn
        .createQueryBuilder(Account, 'acc')
        .leftJoinAndSelect('acc.users', 'user')
        .leftJoinAndSelect('user.login_history', 'login_history')
        .getMany();

    const primaryUser = listOfUsers.find(
        (usr) =>
            usr.Attributes?.find((att) => (att?.Name ?? '') === 'sub')
                ?.Value === dbAccounts[0].users[0].cognito_user_id
    ) as UserType[];

    const mergedAccounts = dbAccounts.map((account) => {
        const acc = {
            account: account,
            primary_user: {
                ...account.users[0],
                ...primaryUser[0],
            },
        };
        return acc;
    });

    const mappedAccount = mergedAccounts.map((acc) => ({
        ...acc.account,
        primary_user: {
            id: acc.primary_user.cognito_user_id,
            email: getAttribute(acc.primary_user.Attributes ?? [], 'email'),
            given_name: getAttribute(
                acc.primary_user.Attributes ?? [],
                'given_name'
            ),
            family_name: getAttribute(
                acc.primary_user.Attributes ?? [],
                'family_name'
            ),
            phone_number: getAttribute(
                acc.primary_user.Attributes ?? [],
                'phone_number'
            ),
            last_login:
                acc.primary_user.login_history?.length > 0
                    ? acc.primary_user.login_history.reduce((a, b) =>
                          new Date(a.date) > new Date(b.date) ? a : b
                      )
                    : null,
        },
    }));
    return mappedAccount;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main: any = middyfy(handler);
