import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, ProductSubmissionsView } from '@medii/data';

const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    const products = await dbConn
        .createQueryBuilder(ProductSubmissionsView, 'psv')
        .orderBy('create_at', 'DESC', 'NULLS LAST')
        .getMany();

    return products;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main: any = middyfy(handler);
