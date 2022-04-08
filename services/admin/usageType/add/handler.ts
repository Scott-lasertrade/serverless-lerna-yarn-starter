import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, UsageType } from '@medii/data';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const dbConn = await database.getConnection();

    const name = event.body.name;
    const newUsageType = new UsageType();
    newUsageType.name = name;
    newUsageType.created_by =
        event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;

    const usageTypeRepository = dbConn.getRepository(UsageType);

    console.log('Saving usage type...');

    await usageTypeRepository.save(newUsageType);
    console.log('Saved usage type', newUsageType);

    return { newUsageType };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
