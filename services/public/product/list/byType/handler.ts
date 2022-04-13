import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Product } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    const { type } = event.pathParameters;
    if (type !== 'Device' && type !== 'Accessory') {
        throw new AppError(`incorrect device type provided`, 400);
    }

    const dbConn = await database.getConnection();
    const products = await dbConn
        .createQueryBuilder(Product, 'p')
        .innerJoinAndSelect('p.product_type', 'type')
        .where('type.name = :productType', { productType: type })
        .getMany();

    return products;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
