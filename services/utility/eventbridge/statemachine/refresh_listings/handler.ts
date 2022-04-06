import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout } from '@medii/api-lambda';
import { startStateMachine } from '@medii/statemachine';

const LISTINGS_REFRESH_DELAY = 3;

const task: any = async () => {
    const data = {
        delay: LISTINGS_REFRESH_DELAY,
        timeInitiated: Date.now(),
    };

    await startStateMachine(
        process.env.REFRESHLISTINGVIEWS_ARN ?? '',
        process.env.OFFLINE_STEP_FUNCTIONS_ARN_RefreshListingViews ?? '',
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
