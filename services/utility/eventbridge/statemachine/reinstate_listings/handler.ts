import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { AppError } from '@medii/common';
import { handleTimeout } from '@medii/api-lambda';
import { startStateMachine } from '@medii/statemachine';

const LISTINGS_REINSTATE_DELAY = 3;

const task: any = async (event) => {
    if (!event?.detail?.listings || !event?.detail?.transactionId) {
        throw new AppError('Recieved bad body', 400);
    }
    const data = {
        delay: LISTINGS_REINSTATE_DELAY,
        listings: event.detail.listings,
        transactionId: event.detail.transactionId,
    };

    await startStateMachine(
        process.env.REINSTATELISTINGS_ARN ?? '',
        process.env.OFFLINE_STEP_FUNCTIONS_ARN_ReinstateListings ?? '',
        data,
        (process.env.STAGE ?? '') === 'offline'
    );

    const response = {
        statusCode: 200,
    };
    return response;
};

export const main = async (event, context) => {
    try {
        console.log(event);
        return await handleTimeout(task(event, context), context);
    } catch (e: any) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: e.message ? e.message : e,
            }),
        };
    }
};
