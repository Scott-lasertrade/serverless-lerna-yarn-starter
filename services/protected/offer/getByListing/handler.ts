import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Offer } from '@medii/data';
import { AppError } from '@medii/common';
const database = new Database();

const task = async (event) => {
    let dbConn = await database.getConnection();
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;

    if (!Number(event.pathParameters.id)) {
        throw new AppError(
            `Incorrect ids format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const listingId = Number(event.pathParameters.id);

    const offer = await dbConn
        .createQueryBuilder(Offer, 'o')
        .innerJoinAndSelect('o.status', 'os')
        .innerJoinAndSelect('o.listing', 'l')
        .innerJoinAndSelect('l.listing_status', 'ls')
        .innerJoinAndSelect('o.account', 'a')
        .innerJoinAndSelect('a.users', 'u')
        .where('u.cognito_user_id = :userId', {
            userId: userId,
        })
        .andWhere('l.id = :listingId', { listingId: listingId })
        .getOne();

    if (!offer) {
        return { statusCode: 204 };
    }
    return offer;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
