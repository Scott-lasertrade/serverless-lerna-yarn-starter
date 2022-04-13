import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Question, User } from '@medii/data';
import { AppError } from '@medii/common';
import { addQuestionReportTicket } from '@medii/hubspot';
import schema from './schema';
const database = new Database();

const task = async (event) => {
    const dbConn = await database.getConnection();
    const hubspot_contact_id = event.body.hubspot_account_id;
    const questionId = event.body.question_id;

    const validateAccount = await dbConn
        .createQueryBuilder(User, 'u')
        .innerJoin('a.users', 'u')
        .where('u.cognito_user_id = :userId', {
            userId: event.headers.currentuserid,
        })
        .andWhere('u.hubspot_user_id = :hsId', { hsId: hubspot_contact_id })
        .getOne();

    if (!validateAccount) {
        throw new AppError(
            'Missmatch between user and hubspot user account',
            401
        );
    }

    const reportTicket = await addQuestionReportTicket(
        hubspot_contact_id,
        questionId
    );
    console.log(`Hubspot ticket made for question with id [${questionId}]`);
    const toDelete = await dbConn
        .getRepository(Question)
        .findOneOrFail(questionId);

    toDelete.updated_by =
        event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
    const deletedQuestion = await dbConn
        .getRepository(Question)
        .softRemove(toDelete);

    return { reportTicket, deletedQuestion };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
