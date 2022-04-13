import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Question, Listing, Account } from '@medii/data';
import { AppError } from '@medii/common';
import { getUNAndEmailFromCogId, handelTemplateEmail } from '@medii/ses';
import htmlBody from './htmlBody';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const account_id = event.body.account_id;
    const listing_id = event.body.listing_id;
    const text = event.body.text;

    const dbConn = await database.getConnection();

    const asker_account = await dbConn
        .createQueryBuilder(Account, 'a')
        .innerJoin('a.users', 'u')
        .where('a.id = :accountId', { accountId: account_id })
        .andWhere('u.cognito_user_id = :userId', {
            userId: event.headers.currentuserid ?? event.headers.CurrentUserId,
        })
        .getOne();

    if (!asker_account) {
        throw new AppError(
            'Could not associate user with specified account',
            401
        );
    }

    let new_question = new Question();

    await dbConn.transaction(async (transactionalEntityManager) => {
        let question = new Question();
        question.listing =
            (await transactionalEntityManager
                .createQueryBuilder(Listing, 'l')
                .innerJoinAndSelect('l.account', 'a')
                .innerJoinAndSelect('a.users', 'au')
                .innerJoinAndSelect('l.product', 'p')
                .where('l.id = :listingId', { listingId: listing_id })
                .getOne()) ?? new Listing();
        question.asker = asker_account;
        question.question = text;
        question.created_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        question.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        new_question = await transactionalEntityManager
            .getRepository(Question)
            .save(question);
        await Promise.all(
            question.listing.account.users.map(async (usr) => {
                const UNE = await getUNAndEmailFromCogId(usr.cognito_user_id);
                await handelTemplateEmail(
                    `Someone has asked a question about your ${question.listing.product.name}.`,
                    htmlBody(
                        UNE.userName,
                        question.listing.product.name,
                        question.question,
                        `${process.env.HOSTING_DOMAIN}/account/questions`
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
