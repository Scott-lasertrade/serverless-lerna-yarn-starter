import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { AppError } from '@medii/common';
import { Database, Account, User } from '@medii/data';
import {
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    AdminGetUserCommandInput,
    AdminGetUserCommand,
    AttributeType,
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

const task = async (event) => {
    if (!Number(event.pathParameters.id)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const accountId = Number(event.pathParameters.id);

    const dbConn = await database.getConnection();

    const account = await dbConn
        .createQueryBuilder(Account, 'acc')
        // My Listings
        // .leftJoinAndSelect('acc.listings', 'listings')
        // .leftJoinAndSelect('listings.product', 'prod')
        // .leftJoinAndSelect('prod.manufacturers', 'man')
        // .leftJoinAndSelect('listings.listing_status', 'ls')
        // My Address
        .leftJoinAndSelect('acc.address', 'addr')
        .leftJoinAndSelect('addr.country', 'coun')
        // My Offers Made
        // .leftJoinAndSelect('acc.offers', 'offers_made')
        // .leftJoinAndSelect('offers_made.status', 'offers_made_status')
        // .leftJoinAndSelect('offers_made.listing', 'offers_made_listing')
        // .leftJoinAndSelect('offers_made_listing.product', 'offers_made_product')
        // .leftJoinAndSelect(
        //     'offers_made_product.manufacturers',
        //     'offers_made_manufacturer'
        // )
        // //      Sellers Account
        // .leftJoinAndSelect('offers_made.account', 'sellerAcc')
        // // My Offers Recieved
        // .leftJoinAndSelect('listings.offers', 'offers_recieved')
        // .leftJoinAndSelect('offers_recieved.status', 'offers_recieved_status')
        // //      Buyers Account
        // .leftJoinAndSelect('offers_recieved.account', 'offers_recieved_by')
        .where('acc.id = :id', { id: accountId })
        .getOneOrFail();

    const primaryAccountUser = await dbConn
        .createQueryBuilder(User, 'user')
        .leftJoinAndSelect('user.login_history', 'history')
        .innerJoin('user.accounts', 'acc')
        .where('acc.id = :id', { id: accountId })
        .getOneOrFail();

    const config: CognitoIdentityProviderClientConfig = {
        region: 'ap-southeast-2',
    };
    const client = new CognitoIdentityProviderClient(config);

    const adminGetUserInput: AdminGetUserCommandInput = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: primaryAccountUser.cognito_user_id,
    };
    const adminGetUserCommand = new AdminGetUserCommand(adminGetUserInput);
    const user = await client.send(adminGetUserCommand);

    const mappedAccount = {
        ...account,
        primary_user: {
            ...primaryAccountUser,
            email: user?.UserAttributes
                ? getAttribute(user.UserAttributes ?? [], 'email')
                : '',
            given_name: user?.UserAttributes
                ? getAttribute(user.UserAttributes ?? [], 'given_name')
                : '',
            family_name: user?.UserAttributes
                ? getAttribute(user.UserAttributes ?? [], 'family_name')
                : '',
            phone_number: user?.UserAttributes
                ? getAttribute(user.UserAttributes ?? [], 'phone_number')
                : '',
        },
    };

    return mappedAccount;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
