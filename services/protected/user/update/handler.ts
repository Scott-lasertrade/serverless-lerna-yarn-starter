import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import {
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    AttributeType,
    AdminUpdateUserAttributesCommandInput,
    AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import schema from './schema';

const task = async (event) => {
    const cogUserId =
        event.headers.CurrentUserId ?? event.headers.currentuserid;
    const email = event.body.email;
    const givenName = event.body.firstName;
    const familyName = event.body.lastName;
    const phone = event.body.phoneNumber;

    let attributesToUpdate: AttributeType[] = [];

    if (givenName) {
        attributesToUpdate.push({ Name: 'given_name', Value: givenName });
    }
    if (familyName) {
        attributesToUpdate.push({ Name: 'family_name', Value: familyName });
    }
    if (email) {
        attributesToUpdate.push({ Name: 'email', Value: email });
        attributesToUpdate.push({ Name: 'email_verified', Value: 'false' });
    }
    if (phone) {
        attributesToUpdate.push({
            Name: 'phone_number',
            Value: phone.startsWith('0') ? phone.replace('0', '+61') : phone,
        });
        attributesToUpdate.push({
            Name: 'phone_number_verified',
            Value: 'false',
        });
    }

    const config: CognitoIdentityProviderClientConfig = {
        region: 'ap-southeast-2',
    };
    const client = new CognitoIdentityProviderClient(config);

    const adminUpdateUserInput: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: cogUserId,
        UserAttributes: attributesToUpdate,
    };
    const adminUpdateUser = new AdminUpdateUserAttributesCommand(
        adminUpdateUserInput
    );
    const response = await client.send(adminUpdateUser);

    return response;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
