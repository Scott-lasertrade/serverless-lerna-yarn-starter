import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Manufacturer } from '@medii/data';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const dbConn = await database.getConnection();

    const name = event.body.name;
    const newManufacturer = new Manufacturer();
    newManufacturer.name = name;
    newManufacturer.created_by =
        event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;

    const manufacturerRepository = dbConn.getRepository(Manufacturer);

    console.log('Saving manufacturer...');
    await manufacturerRepository.save(newManufacturer);
    console.log('Saved manufacturer', newManufacturer);

    return { newManufacturer };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
