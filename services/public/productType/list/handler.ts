import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, ProductType } from '@medii/data';

const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    const productTypes = await dbConn
        .createQueryBuilder(ProductType, 'pt')
        .orderBy('id')
        .getMany();

    return productTypes;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main: any = middyfy(handler);
