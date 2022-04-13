import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Offer } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    const aId = Number(event.pathParameters.aId);
    const lId = Number(event.pathParameters.lId);
    if (!Number(lId) || !Number(aId)) {
        throw new AppError(
            `Incorrect id(s) format provided - ${lId} | ${aId}`,
            400
        );
    }

    let dbConn = await database.getConnection();
    const offer = await dbConn
        .createQueryBuilder(Offer, 'o')
        .innerJoinAndSelect('o.account', 'a')
        .leftJoinAndSelect('o.listing', 'l')
        .leftJoinAndSelect('o.status', 'os')
        .where('o.accountId = :accountId', {
            accountId: aId,
        })
        .andWhere('o.listingId = :listingId', {
            listingId: lId,
        })
        .getOne();
    if (!offer) {
        return { offer: null };
    }
    return { offer: offer };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
