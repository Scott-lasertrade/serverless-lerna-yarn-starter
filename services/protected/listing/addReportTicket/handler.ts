import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, User } from '@medii/data';
import { AppError } from '@medii/common';
import { addReportTicket } from '@medii/hubspot';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.id)) {
        throw new AppError(
            `Incorrect ids format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const listingId = Number(event.pathParameters.id);
    const productId = event.body.product_id;

    const dbConn = await database.getConnection();

    const user = await dbConn
        .createQueryBuilder(User, 'u')
        .where('u.cognito_user_id = :userId', {
            userId: event.headers.currentuserid,
        })
        .getOne();

    if (!user) {
        throw new AppError('Could not find an account relating to user', 401);
    }

    const reportTicket = await addReportTicket(
        Number(user.hubspot_user_id),
        listingId,
        productId
    );

    return reportTicket;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
