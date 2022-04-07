import 'source-map-support/register';
import { PreSignUpTriggerEvent, Context, Callback } from 'aws-lambda';
import {
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    ListUsersCommand,
    ListUsersCommandInput,
    AdminLinkProviderForUserCommandInput,
    AdminLinkProviderForUserCommand,
    AdminCreateUserCommandInput,
    AdminCreateUserCommand,
    MessageActionType,
    AdminSetUserPasswordCommandInput,
    AdminSetUserPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const EXTERNAL_AUTHENTICATION_PROVIDER = 'PreSignUp_ExternalProvider';

function generatePassword() {
    return `${Math.random() // Generate random number, eg: 0.123456
        .toString(36) // Convert  to base-36 : "0.4fzyo82mvyr"
        .slice(-9)}A42`; // Cut off last 8 characters : "yo82mvyr" and add a number & captial letter, because the cognito password policy requires a number
}

export const main = async (
    event: PreSignUpTriggerEvent,
    _context: Context,
    callback: Callback
): Promise<void> => {
    console.log(event);

    const {
        triggerSource,
        userPoolId,
        userName,
        request: {
            // You won't have given_name and family_name attributes
            // if you haven't specified them as required when the user registers
            userAttributes: { email, given_name },
        },
    } = event;

    try {
        if (triggerSource === EXTERNAL_AUTHENTICATION_PROVIDER) {
            const config: CognitoIdentityProviderClientConfig = {
                region: 'ap-southeast-2',
            };
            const client = new CognitoIdentityProviderClient(config);

            const listUsersInput: ListUsersCommandInput = {
                UserPoolId: userPoolId,
                Filter: `email = "${email}"`,
            };
            const listUsersCommand = new ListUsersCommand(listUsersInput);
            const usersFilteredByEmail = await client.send(listUsersCommand);

            const [providerNameValue, providerUserId] = userName.split('_');
            const providerName =
                providerNameValue.charAt(0).toUpperCase() +
                providerNameValue.slice(1);

            if (
                usersFilteredByEmail.Users &&
                usersFilteredByEmail.Users.length > 0
            ) {
                // user already has cognito account
                const cognitoUsername =
                    usersFilteredByEmail.Users[0].Username ||
                    'username-not-found';

                const adminLinkProviderInput: AdminLinkProviderForUserCommandInput =
                    {
                        UserPoolId: userPoolId,
                        DestinationUser: {
                            ProviderName: 'Cognito',
                            ProviderAttributeValue: cognitoUsername,
                        },
                        SourceUser: {
                            ProviderName: providerName,
                            ProviderAttributeName: 'Cognito_Subject',
                            ProviderAttributeValue: providerUserId,
                        },
                    };
                const adminLinkProviderCommand =
                    new AdminLinkProviderForUserCommand(adminLinkProviderInput);
                await client.send(adminLinkProviderCommand);
            } else {
                /* --> user does not have a cognito native account ->
                1. create a native cognito account
                2. change the password, to change status from FORCE_CHANGE_PASSWORD to CONFIRMED
                3. merge the social and the native accounts
                4. add the user to a group - OPTIONAL
            */
                const adminCreateUserInput: AdminCreateUserCommandInput = {
                    UserPoolId: userPoolId,
                    // SUPRESS prevents sending an email with the temporary password
                    // to the user on account creation
                    MessageAction: MessageActionType.SUPPRESS,
                    Username: email,
                    UserAttributes: [
                        {
                            Name: 'given_name',
                            Value: given_name,
                        },
                        {
                            Name: 'email',
                            Value: email,
                        },
                        {
                            Name: 'email_verified',
                            Value: 'true',
                        },
                    ],
                };
                const adminCreateUserCommand = new AdminCreateUserCommand(
                    adminCreateUserInput
                );
                const createdCognitoUser = await client.send(
                    adminCreateUserCommand
                );

                const adminSetUserPasswordInput: AdminSetUserPasswordCommandInput =
                    {
                        Password: generatePassword(),
                        UserPoolId: userPoolId,
                        Username: email,
                        Permanent: true,
                    };
                const adminSetUserPassword = new AdminSetUserPasswordCommand(
                    adminSetUserPasswordInput
                );
                await client.send(adminSetUserPassword);

                const cognitoNativeUsername =
                    createdCognitoUser.User?.Username || 'username-not-found';

                const adminLinkProviderInput: AdminLinkProviderForUserCommandInput =
                    {
                        UserPoolId: userPoolId,
                        DestinationUser: {
                            ProviderName: 'Cognito',
                            ProviderAttributeValue: cognitoNativeUsername,
                        },
                        SourceUser: {
                            ProviderName: providerName,
                            ProviderAttributeName: 'Cognito_Subject',
                            ProviderAttributeValue: providerUserId,
                        },
                    };
                const adminLinkProviderCommand =
                    new AdminLinkProviderForUserCommand(adminLinkProviderInput);
                await client.send(adminLinkProviderCommand);

                // OPTIONALLY add the user to a group
                // await cognito
                //     .adminAddUserToGroup({
                //         GroupName: 'Users',
                //         UserPoolId: userPoolId,
                //         Username: cognitoNativeUsername,
                //     })
                //     .promise();

                event.response.autoVerifyEmail = true;
                event.response.autoConfirmUser = true;
            }
        }
        return callback(null, event);
    } catch (err) {
        if (err instanceof Error) {
            callback(err, null);
        } else {
            // handle
        }
    }
};
