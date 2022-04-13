import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing } from '@medii/data';

const database = new Database();

const task = async () => {
    const dbConn = await database.getConnection();
    const listing = await dbConn
        .createQueryBuilder(Listing, 'listing')
        .innerJoinAndSelect('listing.product', 'product')
        .leftJoinAndSelect('listing.listing_accessories', 'listing_accessory')
        .leftJoinAndSelect('listing_accessory.product', 'accessory')
        .leftJoinAndSelect('listing_accessory.usage', 'accessory_usage')
        .leftJoinAndSelect('listing.currency_type', 'currency_type')
        .leftJoinAndSelect('listing.listing_images', 'listing_image')
        .leftJoinAndSelect('listing.account', 'account')
        .leftJoinAndSelect('listing.usage', 'usage')
        .leftJoinAndSelect('listing.offers', 'offers')
        .getMany();
    return listing;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main = middyfy(handler);
