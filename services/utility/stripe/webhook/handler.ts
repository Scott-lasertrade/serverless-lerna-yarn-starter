import { Context } from 'aws-lambda';
import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { AppError } from '@medii/common';
import { handleTimeout } from '@medii/api-lambda';
import { sendToEventBridge } from '@medii/eventbridge';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPESECRETKEY ?? '', {
    apiVersion: '2020-08-27',
});

const endpointSecret = process.env.STRIPEWEBHOOK;

const task: any = async (event) => {
    const sig = event.headers['Stripe-Signature'];
    try {
        const stripeEvent = stripe.webhooks.constructEvent(
            event.body,
            sig,
            endpointSecret ?? ''
        );
        console.log(`EVENT BRIDGE| Starting...`, stripeEvent);
        await sendToEventBridge(
            process.env.EVENT_BRIDGE ?? '',
            stripeEvent,
            process.env.STAGE ?? ''
        );
    } catch (err: any) {
        console.error(`EVENT BRIDGE| Error: ${err.message}`);
        throw new AppError(`EVENT BRIDGE| Error: ${err.message}`, 400);
    }

    // Return a 200 response to acknowledge receipt of the event
    const response = {
        statusCode: 200,
    };
    return response;
};

export const main = async (event, context: Context) => {
    try {
        return await handleTimeout(task(event), context);
    } catch (e: any) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: e.message ? e.message : e,
            }),
        };
    }
};

// SHOULD FORCE A BUILD?
