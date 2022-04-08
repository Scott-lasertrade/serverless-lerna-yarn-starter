import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Question } from '@medii/data';
import { AppError } from '@medii/common';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.qId)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.qId}`,
            400
        );
    }
    const question_id = Number(event.pathParameters.qId);
    const questionText = event.body.question;
    const answer = event.body.answer;
    const version = event.body.version;

    const dbConn = await database.getConnection();
    let new_question: Question = new Question();

    await dbConn.transaction(async (transactionalEntityManager) => {
        const question = await transactionalEntityManager
            .createQueryBuilder(Question, 'q')
            .where('q.id = :questionId', { questionId: question_id })
            .getOneOrFail();
        question.question = questionText;
        question.answer = answer;

        question.version = version;
        question.updated_by = event.headers.AuthorizedUserId;
        new_question = await transactionalEntityManager
            .getRepository(Question)
            .save(question);
    });

    return new_question;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
