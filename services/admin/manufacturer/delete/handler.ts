import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Manufacturer } from '@medii/data';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const id = event.body.id;
    const version = event.body?.version;

    const dbConn = await database.getConnection();
    const manufacturerRepository = dbConn.getRepository(Manufacturer);
    const manufacturerToDelete = await manufacturerRepository.findOneOrFail(
        Number(id)
    );
    manufacturerToDelete.version = version;
    const deletedProduct = await manufacturerRepository.softRemove(
        manufacturerToDelete
    );

    return deletedProduct;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
