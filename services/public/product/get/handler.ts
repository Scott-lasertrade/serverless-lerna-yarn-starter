import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Product } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    const { id } = event.pathParameters;
    if (!Number(id)) {
        throw new AppError(`Incorrect id format provided - ${id}`, 400);
    }

    const dbConn = await database.getConnection();
    // const productRepository = dbConn.getRepository(Product);
    const product = await dbConn
        .createQueryBuilder(Product, 'p')
        .leftJoinAndSelect('p.product_type', 'pt')
        .leftJoinAndSelect('p.usage_type', 'ut')
        .leftJoinAndSelect('p.product_images', 'pi')
        .leftJoinAndSelect('p.manufacturers', 'm')
        .leftJoinAndSelect('p.categories', 'pc')
        .leftJoinAndSelect('p.connections', 'connections')
        .leftJoinAndSelect('connections.usage_type', 'cut')
        .leftJoinAndSelect('p.dimensions', 'pd')
        .leftJoinAndSelect('p.listings', 'l')
        .leftJoinAndSelect('l.listing_status', 'lls')
        .where('p.id = :productId', {
            productId: Number(id),
        })
        .getOneOrFail();

    const parents = await dbConn.query(
        `select p2.* from product p
            inner join product_connections_product pcp on pcp.accessory = p.id and pcp.accessory = $1
            inner join product p2 on p2.id = pcp.product 
            where p.id = $1 and p.deleted_date is null`,
        [Number(id)]
    );
    product.parents = parents;
    return product;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
