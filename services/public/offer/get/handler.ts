import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Offer } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.id)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const id = Number(event.pathParameters.id);

    const dbConn = await database.getConnection();
    const offerRepository = dbConn.getRepository(Offer);
    const offer = await dbConn
        .createQueryBuilder(Offer, 'o')
        .innerJoinAndSelect('o.status', 'os')
        .innerJoinAndSelect('o.listing', 'l')
        .innerJoinAndSelect('l.product', 'p')
        .innerJoinAndSelect('l.account', 'a')
        .leftJoinAndSelect('o.offer_history', 'oh')
        .leftJoinAndSelect('oh.status', 'ohs')
        .where('o.id = :inputId', {
            inputId: id,
        })
        .getOneOrFail();
    return offer;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
