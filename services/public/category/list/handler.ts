import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Category } from '@medii/data';

const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    const categoryTree = await dbConn
        .createQueryBuilder(Category, 'category')
        .loadRelationCountAndMap('category.products', 'category.products')
        .getMany();

    return categoryTree;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main = middyfy(handler);
