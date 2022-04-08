import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Manufacturer } from '@medii/data';
import { AppError } from '@medii/common';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const id = event.pathParameters?.id;

    if (!Number(id)) {
        throw new AppError(`Incorrect id format provided - ${id}`, 400);
    }
    const dbConn = await database.getConnection();

    const manufacturerRepository = dbConn.getRepository(Manufacturer);
    let manufacturerToUpdate = await manufacturerRepository.findOneOrFail(
        Number(id)
    );
    manufacturerToUpdate.is_approved = event.body.status;

    console.log('Updating manufacturer...');
    manufacturerToUpdate.updated_by =
        event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
    manufacturerToUpdate = await manufacturerRepository.save(
        manufacturerToUpdate
    );
    console.log('Updated manufacturer', manufacturerToUpdate);

    return manufacturerToUpdate;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
