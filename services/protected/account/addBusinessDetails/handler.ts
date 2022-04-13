import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, User, Account } from '@medii/data';
import { AppError } from '@medii/common';
import { updateHSContact } from '@medii/hubspot';
import schema from './schema';

const database = new Database();

const handleUserDetailsUpdate = async (
    dbConn: any,
    cogUserId: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
) => {
    const user = await dbConn
        .createQueryBuilder(User, 'u')
        .where('u.cognito_user_id = :cogId', {
            cogId: cogUserId,
        })
        .getOne();
    if (!user) {
        throw new AppError(
            `User data provided, but no user found for id: ${cogUserId}`,
            400
        );
    } else {
        await updateHSContact(
            user.hubspot_user_id,
            firstName,
            lastName,
            phoneNumber
        );
    }
};

const task = async (event) => {
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;

    if (!Number(event.pathParameters.accountId)) {
        throw new AppError(
            `Incorrect ids format provided - ${event.pathParameters.accountId}`,
            400
        );
    }
    const accountId = Number(event.pathParameters.accountId);
    const accountType = event.body.accountType;

    const dbConn = await database.getConnection();
    if (userId) {
        handleUserDetailsUpdate(
            dbConn,
            userId,
            event.body.firstName,
            event.body.lastName,
            event.body.phoneNumber
        );
    }

    let account: Account = new Account();
    if (accountType) {
        const accountToUpdate = await dbConn
            .createQueryBuilder(Account, 'a')
            .where('a.id = :accId', {
                accId: accountId,
            })
            .getOne();
        if (!accountToUpdate) {
            throw new AppError(
                `Account data provided, but no account found for id: ${accountId}`,
                400
            );
        }
        accountToUpdate.account_type = event.body.accountType;
        accountToUpdate.business_name = event.body.businessName;
        accountToUpdate.business_phone_number = event.body.businessPhoneNumber;
        accountToUpdate.legal_name = event.body.legalName;
        accountToUpdate.tax_id = event.body.taxId;
        accountToUpdate.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;

        account = await dbConn.getRepository(Account).save(accountToUpdate);
    }
    return account;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
