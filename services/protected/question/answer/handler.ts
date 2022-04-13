import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Question } from '@medii/data';
import { AppError } from '@medii/common';
import { getUNAndEmailFromCogId, handelTemplateEmail } from '@medii/ses';
import htmlBody from './htmlBody';
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
    const text = event.body.text;
    const version = event.body.version;
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;

    const dbConn = await database.getConnection();
    let new_question = new Question();

    await dbConn.transaction(async (transactionalEntityManager) => {
        let question = await transactionalEntityManager
            .createQueryBuilder(Question, 'q')
            .innerJoinAndSelect('q.listing', 'l')
            .innerJoinAndSelect('l.product', 'lp')
            .innerJoinAndSelect('l.account', 'a')
            .innerJoinAndSelect('a.users', 'u')
            .innerJoinAndSelect('q.asker', 'qa')
            .innerJoinAndSelect('qa.users', 'qau')
            .where('q.id = :questionId', { questionId: question_id })
            .andWhere('u.cognito_user_id = :userId', { userId: userId })
            .getOneOrFail();
        question.answer = text;

        question.version = version;
        question.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        new_question = await transactionalEntityManager
            .getRepository(Question)
            .save(question);
        await Promise.all(
            question.asker.users.map(async (usr) => {
                const UNE = await getUNAndEmailFromCogId(usr.cognito_user_id);
                await handelTemplateEmail(
                    `The seller has answered your question about the ${question.listing.product.name}.`,
                    htmlBody(
                        UNE.userName,
                        question.listing.product.name,
                        question.question,
                        question.answer,
                        `${process.env.HOSTING_DOMAIN}/product/${question.listing.product.id}/listing/${question.listing.id}`
                    ),
                    UNE.emailAddress ?? ''
                );
            })
        );
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
