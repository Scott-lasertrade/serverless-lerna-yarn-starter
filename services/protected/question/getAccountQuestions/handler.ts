import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Question } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.aId)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.aId}`,
            400
        );
    }
    const aId = Number(event.pathParameters.aId);

    const dbConn = await database.getConnection();
    const questions = await dbConn
        .createQueryBuilder(Question, 'q')
        .innerJoinAndSelect('q.listing', 'l')
        .innerJoinAndSelect('l.product', 'lp')
        .leftJoinAndSelect('lp.manufacturers', 'lpm')
        .innerJoinAndSelect('l.account', 'la')
        .innerJoin('la.users', 'u')
        .leftJoinAndSelect('l.listing_images', 'li')
        .where('la.id = :accountId', {
            accountId: aId,
        })
        .andWhere('u.cognito_user_id = :userId', {
            userId: event.headers.currentuserid ?? event.headers.CurrentUserId,
        })
        .getMany();
    return questions;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
