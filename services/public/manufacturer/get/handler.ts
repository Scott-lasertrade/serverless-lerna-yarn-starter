import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Manufacturer } from '@medii/data';
import { AppError } from '@medii/common';
import { Context } from 'aws-lambda';

const database = new Database();

const task = async (event) => {
    const id = event.pathParameters.id;
    if (!id) {
        throw new AppError(`Could not find manufacturer by id ${id}`, 400);
    }

    const dbConn = await database.getConnection();
    const manufacturerRepository = dbConn.getRepository(Manufacturer);
    const manufacturer = await manufacturerRepository.findOneOrFail(Number(id));
    return manufacturer;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context: Context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
