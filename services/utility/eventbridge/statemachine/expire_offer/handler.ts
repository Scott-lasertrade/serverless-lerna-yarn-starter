import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { AppError } from '@medii/common';
import { handleTimeout } from '@medii/api-lambda';
import { startStateMachine } from '@medii/statemachine';

const task: any = async (event) => {
    if (
        !Number(event?.detail?.offer_id) ||
        !Number(event?.detail?.offer_status_id) ||
        !event?.detail?.expire_on
    ) {
        throw new AppError('Recieved bad body', 400);
    }
    const offer_id = Number(event.detail.offer_id);
    const offer_status_id = Number(event.detail.offer_status_id);
    const expire_on = event.detail.expire_on;

    const data = {
        offer_id: offer_id,
        offer_status_id: offer_status_id,
        expire_on: expire_on,
    };

    await startStateMachine(
        process.env.EXPIREOFFER_ARN,
        process.env.OFFLINE_STEP_FUNCTIONS_ARN_ExpireOffer,
        data,
        process.env.STAGE === 'offline'
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
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: e.message ? e.message : e,
            }),
        };
    }
};
