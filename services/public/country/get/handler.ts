import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Country } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    const id = event.pathParameters.id;
    if (!Number(id)) {
        throw new AppError(`Incorrect id format provided - ${id}`, 400);
    }

    const dbConn = await database.getConnection();
    const countryRepository = dbConn.getRepository(Country);
    const country = await countryRepository.findOneOrFail(Number(id));
    return { country };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
