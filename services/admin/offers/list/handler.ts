import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Offer } from '@medii/data';

const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    const offers = await dbConn
        .createQueryBuilder(Offer, 'offer')
        .leftJoinAndSelect('offer.account', 'buyerAccount')
        .leftJoinAndSelect('offer.status', 'offer_status')
        .leftJoinAndSelect('offer.listing', 'offer_listing')
        .leftJoinAndSelect('offer_listing.product', 'offer_product')
        .leftJoinAndSelect('offer_product.manufacturers', 'offer_manufacturer')
        .innerJoinAndSelect('offer_listing.account', 'seller')
        .getMany();

    if (offers?.length > 0) {
        return offers;
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

export const main = middyfy(handler);
