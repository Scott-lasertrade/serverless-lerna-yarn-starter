import 'source-map-support/register';
import Storage from '@medii/s3';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import schema from './schema';

const task = async (event) => {
    const file = await Storage.get(
        event.body.bucket,
        event.body.key,
        event.body.region
    );
    return file;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
