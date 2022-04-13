import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing, Offer } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    const { aId } = event.pathParameters;
    if (!Number(aId)) {
        throw new AppError(`Incorrect id format provided - ${aId}`, 400);
    }
    const dbConn = await database.getConnection();
    const outgoing = await dbConn
        .createQueryBuilder(Listing, 'listing')
        .innerJoinAndSelect('listing.product', 'product')
        .leftJoinAndSelect('listing.listing_images', 'listing_image')
        .innerJoinAndSelect('listing.account', 'account')
        .leftJoinAndSelect('listing.offers', 'offers')
        .innerJoinAndSelect('listing.listing_status', 'ls')
        .leftJoinAndSelect('offers.account', 'oAccount')
        .leftJoinAndSelect('offers.status', 'status')
        .where('oAccount.id = :accountId', {
            accountId: Number(aId),
        })
        .getMany();
    const myOffers = await dbConn
        .createQueryBuilder(Offer, 'offer')
        .innerJoinAndSelect('offer.status', 'status')
        .innerJoinAndSelect('offer.listing', 'listing')
        .innerJoinAndSelect('listing.account', 'account')
        .innerJoinAndSelect('listing.product', 'product')
        .innerJoinAndSelect('listing.listing_status', 'ls')
        .leftJoinAndSelect('listing.listing_images', 'listing_image')
        .where('account.id = :accountId', {
            accountId: Number(aId),
        })
        .getMany();
    return { outgoing, myOffers };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
