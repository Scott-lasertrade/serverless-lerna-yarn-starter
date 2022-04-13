import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, User } from '@medii/data';
import {
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    AdminGetUserCommandInput,
    AdminGetUserCommand,
    AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';

const getAttribute = (
    AttributeList: AttributeType[],
    attributeName: string
) => {
    return AttributeList?.length > 0
        ? AttributeList.find((attr) => attr.Name === attributeName)?.Value ??
              null
        : null;
};

const database = new Database();

const task = async (event) => {
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;
    const dbConn = await database.getConnection();
    const user = await dbConn
        .createQueryBuilder(User, 'u')
        .innerJoinAndSelect('u.accounts', 'a')
        .leftJoinAndSelect('a.address', 'ad')
        .leftJoinAndSelect('ad.country', 'c')
        .leftJoinAndSelect('ad.address_type', 'adtype')
        .where('u.cognito_user_id = :userId', {
            userId: userId,
        })
        .getOneOrFail();

    const config: CognitoIdentityProviderClientConfig = {
        region: 'ap-southeast-2',
    };
    const client = new CognitoIdentityProviderClient(config);

    const adminGetUserInput: AdminGetUserCommandInput = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: userId,
    };
    const adminGetUserCommand = new AdminGetUserCommand(adminGetUserInput);
    const cognitoUser = await client.send(adminGetUserCommand);

    const mappedUser = {
        ...user,
        ...{
            email: getAttribute(cognitoUser.UserAttributes ?? [], 'email'),
            email_verified: getAttribute(
                cognitoUser.UserAttributes ?? [],
                'email_verified'
            ),
            given_name: getAttribute(
                cognitoUser.UserAttributes ?? [],
                'given_name'
            ),
            family_name: getAttribute(
                cognitoUser.UserAttributes ?? [],
                'family_name'
            ),
            phone_number: getAttribute(
                cognitoUser.UserAttributes ?? [],
                'phone_number'
            ),
            phone_number_verified: getAttribute(
                cognitoUser.UserAttributes ?? [],
                'phone_number_verified'
            ),
            username: cognitoUser.Username,
        },
    };

    console.log('Mapped User', mappedUser);

    return mappedUser;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
