import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, UsageType } from '@medii/data';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const dbConn = await database.getConnection();

    const id = event.body.id;
    const entityRepository = dbConn.getRepository(UsageType);
    const entityToDelete = await entityRepository.findByIds([id]);

    console.log(entityToDelete);
    if (!entityToDelete || entityToDelete.length === 0) {
        console.log(`Could not find Usage Type with id ${id}`);
        throw new Error(`Could not find Usage Type with id ${id}`);
    }

    console.log(`deleting Usage Type...`);
    await entityRepository.remove(entityToDelete);
    console.log(`deleted Usage Type`, entityToDelete);

    return { deletedEntity: entityToDelete };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
