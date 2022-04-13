import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Transaction } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

// TODO - S.Y: When this is reworked it needs to become a protected route and should use new methodology to validate user is part of the account being passed in
const task = async (event) => {
    if (!Number(event.pathParameters.aId)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.aId}`,
            400
        );
    }
    const aId = Number(event.pathParameters.aId);

    const dbConn = await database.getConnection();
    const transac = await dbConn
        .createQueryBuilder(Transaction, 't')
        .innerJoinAndSelect('t.buyer', 'b')
        .innerJoinAndSelect('t.listing', 'l')
        .innerJoinAndSelect('l.product', 'p')
        .leftJoinAndSelect('l.listing_images', 'li')
        .leftJoinAndSelect('p.product_images', 'pimg')
        .where('l.accountId = :accountId', {
            accountId: aId,
        })
        .getMany();
    return transac;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
