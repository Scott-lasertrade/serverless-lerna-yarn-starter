import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { AppError } from '@medii/common';
import {
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    AdminResetUserPasswordCommandInput,
    AdminResetUserPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import schema from './schema';

const task = async (event) => {
    const userId = event.body.userId;
    const config: CognitoIdentityProviderClientConfig = {
        region: 'ap-southeast-2',
    };
    const client = new CognitoIdentityProviderClient(config);

    try {
        const adminResetUserPasswordInput: AdminResetUserPasswordCommandInput =
            {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: userId,
            };
        const adminResetPassword = new AdminResetUserPasswordCommand(
            adminResetUserPasswordInput
        );
        await client.send(adminResetPassword);
        return true;
    } catch (err) {
        console.error(err);
        throw new AppError(`Failed to reset user's password [${userId}]`, 400);
    }
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
