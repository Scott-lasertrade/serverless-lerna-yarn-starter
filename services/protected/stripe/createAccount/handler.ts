import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Account } from '@medii/data';
import { AppError } from '@medii/common';
import { addHSCompany } from '@medii/hubspot';
import schema from './schema';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPESECRETKEY ?? '', {
    apiVersion: '2020-08-27',
});
const database = new Database();

const task = async (event) => {
    const user = event.body.user;
    const accountId = event.body.accountId;
    const address = event.body.address;

    const dbConn = await database.getConnection();
    let account = await dbConn
        .createQueryBuilder(Account, 'a')
        .innerJoinAndSelect('a.users', 'u')
        .where('a.id = :aId', {
            aId: accountId,
        })
        .andWhere('u.cognito_user_id = :userId', {
            userId: event.headers.currentuserid ?? event.headers.CurrentUserId,
        })
        .getOneOrFail();

    let stripeData: Stripe.AccountCreateParams = {
        type: 'express',
        country: address?.country ?? 'AU',
        email: user.email,
        capabilities: {
            // au_becs_debit_payments: { requested: true },
            transfers: { requested: true },
            // card_payments: { requested: true },
        },
        business_type:
            account.account_type === 'individual' ? 'individual' : 'company',
        business_profile: {
            mcc: '8099',
            name: account.legal_name,
            url: (process.env.HOSTING_DOMAIN ?? '').startsWith('http:')
                ? 'https://lasersharks.click/account/sell/listings'
                : `${process.env.HOSTING_DOMAIN}/account/sell/listings`,
        },
        tos_acceptance: { service_agreement: 'full' },
        company: {
            address: {
                line1: address?.addressLine1 ?? undefined,
                line2: address?.addressLine2 ?? undefined,
                city: address?.suburb ?? undefined,
                state: address?.state ?? undefined,
                postal_code: address?.postcode ?? undefined,
                country: address?.country ?? 'AU',
            },
            name: account.business_name ?? undefined,
            phone: account.business_phone_number ?? undefined,
            tax_id: account.tax_id ?? undefined,
        },
        settings: {
            payouts: {
                schedule: {
                    interval: 'manual',
                },
            },
        },
        individual:
            account.account_type === 'individual'
                ? {
                      email: user.email,
                      first_name: user.given_name ?? undefined,
                      last_name: user.family_name ?? undefined,
                      phone: user.phone_number ?? undefined,
                  }
                : undefined,
    };
    if (account.account_type !== 'individual') {
        //Set up HS account for users attached to account
        const hsCompanyId = await addHSCompany(
            account.business_name,
            account.business_phone_number,
            account.users.map((usr) => usr.hubspot_user_id)
        );
        account.hubspot_company_id = hsCompanyId;
    }
    console.log('STRIPE| Connecting Account...', stripeData);
    const stripeAccount = await stripe.accounts.create(stripeData);
    console.log('STRIPE| Connected Account:', stripeAccount);

    account.updated_by =
        event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
    account.stripe_user_id = stripeAccount.id;
    try {
        await dbConn.getRepository(Account).save(account);
    } catch {
        throw new AppError(
            `STRIPE| Failed to save stripe_user_id [${stripeAccount.id}]`,
            400
        );
    }

    return stripeAccount;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
