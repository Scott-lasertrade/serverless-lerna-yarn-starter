import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Category } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event: any) => {
    const id = event.pathParameters.id;
    if (!Number(id)) {
        throw new AppError(`Incorrect id format provided - ${id}`, 400);
    }

    const dbConn = await database.getConnection();
    const categoryRepository = dbConn.getRepository(Category);
    const category = await categoryRepository.findOneOrFail(Number(id), {
        relations: ['parent'],
    });
    return { category };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
