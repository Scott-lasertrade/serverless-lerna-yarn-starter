import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Question } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.lId)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.lId}`,
            400
        );
    }
    const lId = Number(event.pathParameters.lId);

    const dbConn = await database.getConnection();
    console.log(`The listing Id is [${lId}]`);
    const questions = await dbConn
        .createQueryBuilder(Question, 'q')
        .innerJoin('q.listing', 'l')
        .where('l.id = :listingId', {
            listingId: lId,
        })
        .getMany();
    console.log(`QUESTIONS| Found: `, questions);
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
