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
    const product = await dbConn
        .createQueryBuilder(Product, 'p')
        .innerJoinAndSelect('p.manufacturers', 'm')
        .where('m.is_approved = :unapproved', {
            unapproved: false,
        })
        .andWhere('p.id = :id', {
            id: Number(id),
        })
        .getOne();
    if (product) {
        return product;
    } else {
        return { id };
    }
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
