import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Product } from '@medii/data';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const id = event.body.id;
    const version = event.body?.version;

    const dbConn = await database.getConnection();
    const productRepository = dbConn.getRepository(Product);
    const productToDelete = await productRepository.findOneOrFail(Number(id), {
        relations: ['product_images', 'listings', 'connections'],
    });
    productToDelete.version = version;
    productToDelete.updated_by =
        event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
    const deletedProduct = await productRepository.softRemove(productToDelete);

    return { deletedProduct: deletedProduct };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
