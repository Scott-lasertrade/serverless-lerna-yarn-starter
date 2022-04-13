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
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;

    let dbConn = await database.getConnection();
    const offer = await dbConn
        .createQueryBuilder(Offer, 'o')
        .innerJoinAndSelect('o.status', 'os')
        .innerJoinAndSelect('o.account', 'buyerAccount')
        .leftJoinAndSelect('buyerAccount.users', 'buyer')
        .innerJoinAndSelect('o.listing', 'l')
        .innerJoinAndSelect('l.product', 'p')
        .innerJoinAndSelect('l.account', 'acc')
        .leftJoinAndSelect('acc.users', 'seller')
        .leftJoinAndSelect('o.offer_history', 'oh')
        .leftJoinAndSelect('oh.status', 'ohs')
        .where(
            '(buyer.cognito_user_id = :userId OR seller.cognito_user_id = :userId)',
            {
                userId: userId,
            }
        )
        .andWhere('o.id = :id', {
            id: id,
        })
        .getOne();
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
