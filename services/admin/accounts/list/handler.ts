import type { ValidatedEventAPIGatewayProxyEvent } from '@shared/apiGateway';
import Database from '@shared/database';
import { middyfy, handleTimeout } from '@shared/lambda';
import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { Connection } from 'typeorm';
import {
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    ListUsersCommandInput,
    ListUsersCommand,
    AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';
import { Account } from '@entities';
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
    const dbConn: Connection = await database.getConnection();

    const config: CognitoIdentityProviderClientConfig = {
        region: 'ap-southeast-2',
    };
    const client = new CognitoIdentityProviderClient(config);

    const listUsersInput: ListUsersCommandInput = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
    };
    const listUsersCommand = new ListUsersCommand(listUsersInput);
    const listOfUsers = await client.send(listUsersCommand);

    const dbAccounts = await dbConn
        .createQueryBuilder(Account, 'acc')
        .leftJoinAndSelect('acc.users', 'user')
        .leftJoinAndSelect('user.login_history', 'login_history')
        .getMany();

    const mergedAccounts = dbAccounts.map((account) => {
        const acc = {
            account: account,
            primary_user: {
                ...account.users[0],
                ...listOfUsers.Users.find(
                    (cogUser) =>
                        (cogUser.Attributes?.length > 0
                            ? cogUser.Attributes.find(
                                  (attr) => (attr.Name = 'sub')
                              ).Value ?? ''
                            : '') === account.users[0].cognito_user_id
                ),
            },
        };
        return acc;
    });

    const mappedAccount = mergedAccounts.map((acc) => ({
        ...acc.account,
        primary_user: {
            id: acc.primary_user.cognito_user_id,
            email: getAttribute(acc.primary_user.Attributes, 'email'),
            given_name: getAttribute(acc.primary_user.Attributes, 'given_name'),
            family_name: getAttribute(
                acc.primary_user.Attributes,
                'family_name'
            ),
            phone_number: getAttribute(
                acc.primary_user.Attributes,
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

export const main = middyfy(handler);
