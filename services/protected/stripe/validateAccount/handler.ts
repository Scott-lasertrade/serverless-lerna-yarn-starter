import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import schema from './schema';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPESECRETKEY ?? '', {
    apiVersion: '2020-08-27',
});
const task = async (event) => {
    const stripeAccountId = event.body.stripeAccountId;

    console.log('STRIPE| Locating Account...', stripeAccountId);
    const stripeAccount = await stripe.accounts.retrieve(stripeAccountId);
    console.log('STRIPE| Found Account:', stripeAccount);

    return {
        detailsSubmitted: stripeAccount.details_submitted,
        chargesEnabled: stripeAccount.charges_enabled,
    };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
