import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import schema from './schema';
import { handleTimeout, middyfy } from '@medii/api-lambda';

export async function task() {
    return 'hello world';
}

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main = middyfy(handler);
