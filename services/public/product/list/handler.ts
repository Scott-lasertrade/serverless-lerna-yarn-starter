import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Product } from '@medii/data';

const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    const products = await dbConn
        .createQueryBuilder(Product, 'p')
        .leftJoinAndSelect('p.product_images', 'pi')
        .leftJoinAndSelect('p.connections', 'pc')
        .leftJoinAndSelect('p.manufacturers', 'pm')
        .leftJoinAndSelect('p.listings', 'pl')
        .getMany();
    if (products?.length > 0) {
        return products;
    }
    return { statusCode: 204 };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main = middyfy(handler);