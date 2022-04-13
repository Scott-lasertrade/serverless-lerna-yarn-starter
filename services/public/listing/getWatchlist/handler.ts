import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    const { aId } = event.pathParameters;
    if (!Number(aId)) {
        throw new AppError(`Incorrect id format provided - ${aId}`, 400);
    }
    const dbConn = await database.getConnection();
    const listing = await dbConn
        .createQueryBuilder(Listing, 'listing')
        .innerJoinAndSelect('listing.product', 'product')
        .leftJoinAndSelect('product.product_images', 'pimg')
        .leftJoinAndSelect('listing.listing_images', 'listing_image')
        .innerJoinAndSelect('listing.account', 'account')
        .leftJoinAndSelect('listing.offers', 'offers')
        .innerJoinAndSelect('listing.listing_status', 'listing_status')
        .leftJoinAndSelect('offers.account', 'oAccount')
        .leftJoinAndSelect('offers.status', 'status')
        .leftJoinAndSelect('listing.watchlists', 'watchlists')
        .leftJoinAndSelect('watchlists.account', 'wAccount')
        .where('wAccount.id = :accountId', {
            accountId: Number(aId),
        })
        .getMany();
    return listing;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
