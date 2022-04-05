import 'source-map-support/register';
import { Context, Callback, PostAuthenticationTriggerEvent } from 'aws-lambda';
import {
    CognitoIdentityProviderClient,
    AdminUpdateUserAttributesCommand,
    AdminUpdateUserAttributesCommandInput,
    CognitoIdentityProviderClientConfig,
} from '@aws-sdk/client-cognito-identity-provider';

export async function main(
    event: PostAuthenticationTriggerEvent,
    _context: Context,
    callback: Callback
): Promise<void> {
    const { userPoolId, userName } = event;
    console.log('POST AUTHENTICATION EVENT', JSON.stringify(event, null, 2));

    if (event.request.userAttributes.email) {
        const identities = event.request?.userAttributes?.identities;
        const isExternalUser =
            /providername.*facebook/gi.test(identities) ||
            /providername.*google/gi.test(identities);

        if (isExternalUser) {
            try {
                const config: CognitoIdentityProviderClientConfig = {
                    region: 'ap-southeast-2',
                };
                const client = new CognitoIdentityProviderClient(config);
                const input: AdminUpdateUserAttributesCommandInput = {
                    UserPoolId: userPoolId,
                    Username: userName,
                    UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
                };
                const command = new AdminUpdateUserAttributesCommand(input);
                await client.send(command);

                return callback(null, event);
            } catch (error: any) {
                console.log(
                    'POST AUTHENTICATION ERROR: ',
                    JSON.stringify(error, null, 2)
                );
                return callback(error, event);
            }
        }
    }
    return callback(null, event);
}
