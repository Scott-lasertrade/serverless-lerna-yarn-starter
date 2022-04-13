import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing } from '@medii/data';

const database = new Database();

const task = async (event) => {
    //TODO: Move this to admin/resolve how to handle later.
    const dbConn = await database.getConnection();
    const listings = await dbConn
        .createQueryBuilder(Listing, 'listing')
        .leftJoinAndSelect('listing.product', 'product')
        .leftJoinAndSelect('product.dimensions', 'dimension')
        .leftJoinAndSelect('product.product_images', 'product_images')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('listing.listing_accessories', 'listing_accessory')
        .leftJoinAndSelect('listing_accessory.product', 'accessory')
        .leftJoinAndSelect('accessory.product_images', 'accessory_images')
        .leftJoinAndSelect('accessory.usage_type', 'accessory_usage_type')
        .leftJoinAndSelect('listing_accessory.usage', 'accessory_usage')
        .leftJoinAndSelect('listing.currency_type', 'currency_type')
        .leftJoinAndSelect('listing.listing_images', 'listing_image')
        .leftJoinAndSelect('listing.account', 'account')
        .leftJoinAndSelect('listing.usage', 'usage')
        .leftJoinAndSelect('listing.offers', 'offers')
        .leftJoinAndSelect('listing.watchlists', 'watchlists')
        .leftJoinAndSelect('listing.address', 'address')
        .leftJoinAndSelect('address.country', 'country')
        .leftJoinAndSelect('listing.listing_status', 'status')
        .getMany();
    return listings;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
