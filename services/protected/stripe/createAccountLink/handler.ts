import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, User } from '@medii/data';
import { AppError } from '@medii/common';
import schema from './schema';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPESECRETKEY ?? '', {
    apiVersion: '2020-08-27',
});
const database = new Database();

const task = async (event) => {
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;
    const stripeAccountId = event.body.stripeAccountId;
    const dbConn = await database.getConnection();

    // Validate user requesting account link owns stripe account
    const user = await dbConn
        .createQueryBuilder(User, 'u')
        .innerJoinAndSelect('u.accounts', 'a')
        .where('u.cognito_user_id = :cogId', {
            cogId: userId,
        })
        .getOneOrFail();

    if (user.accounts[0]?.stripe_user_id !== stripeAccountId) {
        throw new AppError('Invalid user/stripe account match', 400);
    }

    const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${process.env.HOSTING_DOMAIN}/account/stripe/refresh`,
        return_url: `${process.env.HOSTING_DOMAIN}/account/sell/listings`,
        type: 'account_onboarding',
    });

    console.log('STRIPE| Generated Link:', accountLink);

    return { accountLink, userId: userId };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
