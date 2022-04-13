import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing } from '@medii/data';

const database = new Database();

const task = async (event) => {
    const key = event.body.key;
    const dbConn = await database.getConnection();
    //TODO: Make filter this during the joins, rather than after - difficult
    const listings = await dbConn
        .createQueryBuilder(Listing, 'listing')
        .leftJoinAndSelect('listing.product', 'product')
        .leftJoinAndSelect('product.manufacturers', 'manufacturers')
        .leftJoinAndSelect('product.dimensions', 'dimension')
        .leftJoinAndSelect('product.product_images', 'product_images')
        .leftJoinAndSelect('product.categories', 'product_category')
        .leftJoinAndSelect('listing.listing_accessories', 'listing_accessory')
        .leftJoinAndSelect('listing_accessory.product', 'accessory')
        .leftJoinAndSelect('accessory.product_images', 'accessory_images')
        .leftJoinAndSelect('accessory.usage_type', 'accessory_usage_type')
        .leftJoinAndSelect('listing_accessory.usage', 'accessory_usage')
        .leftJoinAndSelect('listing.currency_type', 'currency_type')
        .leftJoinAndSelect('listing.listing_images', 'listing_image')
        .where('listing_image.order = :order', { order: 0 })
        .leftJoinAndSelect('listing.account', 'account')
        .leftJoinAndSelect('listing.usage', 'usage')
        .leftJoinAndSelect('listing.offers', 'offers')
        .leftJoinAndSelect('listing.watchlists', 'watchlists')
        .leftJoinAndSelect('listing.address', 'address')
        .leftJoinAndSelect('address.country', 'country')
        .leftJoinAndSelect('listing.listing_status', 'status')
        .where('status.name = :sName', { sName: 'Listed' })
        .orderBy('listing.create_at', 'DESC', 'NULLS LAST')
        .getMany();
    const filteredlistings = listings.filter((l) => {
        console.log(key);
        //it's a little convoluted, but if any category contains the key, then take it.
        if (l.product.categories?.length > 0) {
            let categoryArray = l.product.categories.map((cat) => {
                return cat.key.includes(key);
            });
            return categoryArray.some((cat) => cat === true);
        } else {
            return false;
        }
    });
    if (filteredlistings.length > 10) {
        filteredlistings.splice(10);
    }
    return filteredlistings;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
