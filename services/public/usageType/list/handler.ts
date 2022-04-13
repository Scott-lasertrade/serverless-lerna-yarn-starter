import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, UsageType } from '@medii/data';
import { AppError } from '@medii/common';
const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    try {
        const usageTypeRepository = dbConn.getRepository(UsageType);
        const usageTypes = await usageTypeRepository.find();
        return { usageTypes };
    } catch (e) {
        if (e instanceof Error) {
            console.error(`Error: ${e.message}`);
            throw new AppError(`Error: ${e.message}`, 400);
        } else {
            console.error(`Unexpected Error: ${e}`);
            throw new AppError(`Unexpected Error: ${e}`, 400);
        }
    }
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main = middyfy(handler);
