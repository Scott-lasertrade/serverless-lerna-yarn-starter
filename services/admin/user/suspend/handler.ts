import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import {
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    AdminDisableUserCommandInput,
    AdminDisableUserCommand,
    AdminEnableUserCommandInput,
    AdminEnableUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { AppError } from '@medii/common';
import { Database, User } from '@medii/data';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const userId = event.body.userId;
    const dbConn = await database.getConnection();

    const config: CognitoIdentityProviderClientConfig = {
        region: 'ap-southeast-2',
    };
    const client = new CognitoIdentityProviderClient(config);

    try {
        if (event.body.suspend) {
            const adminDisableUserInput: AdminDisableUserCommandInput = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: userId,
            };
            const adminDisableUser = new AdminDisableUserCommand(
                adminDisableUserInput
            );
            await client.send(adminDisableUser);
        } else {
            const adminDisableUserInput: AdminEnableUserCommandInput = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: userId,
            };
            const adminDisableUser = new AdminEnableUserCommand(
                adminDisableUserInput
            );
            await client.send(adminDisableUser);
        }

        const user = await dbConn
            .createQueryBuilder(User, 'u')
            .where('u.cognito_user_id = :userId', { userId: userId })
            .getOneOrFail();

        user.enabled = !event.body.suspend;
        user.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;

        const updatedUser = await dbConn.getRepository(User).save(user);

        return updatedUser;
    } catch (err) {
        console.error(err);
        throw new AppError(`Failed to disable user [${userId}]`, 400);
    }
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
