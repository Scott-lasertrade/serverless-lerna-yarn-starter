import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { AppError } from '@medii/common';
import { Database, Offer } from '@medii/data';
import schema from './schema';
const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.id)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const accountId = Number(event.pathParameters.id);

    const dbConn = await database.getConnection();

    const offers = await dbConn
        .createQueryBuilder(Offer, 'offers_made')
        .innerJoinAndSelect('offers_made.account', 'account')
        .leftJoinAndSelect('offers_made.status', 'offers_made_status')
        .leftJoinAndSelect('offers_made.listing', 'offers_made_listing')
        .leftJoinAndSelect('offers_made_listing.product', 'offers_made_product')
        .leftJoinAndSelect(
            'offers_made_product.manufacturers',
            'offers_made_manufacturer'
        )
        .leftJoinAndSelect('offers_made_listing.account', 'sellerAccount')
        .where('account.id = :id', { id: accountId })
        .getMany();

    if (offers?.length > 0) {
        return offers;
    }
    return { statusCode: 204 };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
