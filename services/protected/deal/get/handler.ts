import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Order } from '@medii/data';
import { AppError } from '@medii/common';
import { getHSDeal } from '@medii/hubspot';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.oId)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.oId}`,
            400
        );
    }
    const orderId = Number(event.pathParameters.oId);
    const dbConn = await database.getConnection();

    // S.Y - Note when we have multiple users for an account this will not work...
    const order = await dbConn
        .createQueryBuilder(Order, 'o')
        .where('o.id = :OrderId', {
            OrderId: Number(orderId),
        })
        .getOneOrFail();
    // In future we need to get some form of hubspot id from order, rather than passing a hardcoded number to HSDeal

    //userID is for security and isnt necessary

    const hsDeal = await getHSDeal('8156661004');
    // @ts-ignore
    const dealStage = hsDeal.response.body.properties.dealstage;
    let finalReturn = '';
    switch (dealStage) {
        case '14722625':
            finalReturn = 'Order Placed';
            break;
        case '14722626':
            finalReturn = 'Inspection';
            break;
        case '14722627':
            finalReturn = 'Balance';
            break;
        case '14722628':
            finalReturn = 'Ready for Shipping';
            break;
        case '14722629':
            finalReturn = 'Delivered';
            break;
        case '14722630':
            finalReturn = 'Accepted';
            break;
        case '14722631':
            finalReturn = 'Rejected';
            break;
        case '14597244':
            finalReturn = 'Cancelled';
            break;
        case '14721113':
            finalReturn = 'Shipping Booked';
            break;
        default:
            finalReturn = 'Unknown';
            break;
    }

    return { dealStage, finalReturn };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
