import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Question } from '@medii/data';

const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    const questions = await dbConn
        .createQueryBuilder(Question, 'q')
        .innerJoinAndSelect('q.listing', 'l')
        .innerJoinAndSelect('l.product', 'lp')
        .leftJoinAndSelect('lp.manufacturers', 'lpm')
        .innerJoinAndSelect('l.account', 'la')
        .leftJoinAndSelect('q.asker', 'a')
        .orderBy('q.create_at', 'DESC', 'NULLS LAST')
        .getMany();

    if (questions?.length > 0) {
        return questions;
    }
    return { statusCode: 204 };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main: any = middyfy(handler);
