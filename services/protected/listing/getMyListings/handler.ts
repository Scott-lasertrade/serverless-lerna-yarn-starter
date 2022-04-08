import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    const { aId } = event.pathParameters;
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;
    if (!Number(aId)) {
        throw new AppError(`Incorrect id format provided - ${aId}`, 400);
    }
    const dbConn = await database.getConnection();
    const myListings = await dbConn
        .createQueryBuilder(Listing, 'listing')
        .innerJoinAndSelect('listing.product', 'product')
        .leftJoinAndSelect('product.product_images', 'pimg')
        .leftJoinAndSelect('product.manufacturers', 'm')
        .leftJoinAndSelect('listing.listing_images', 'listing_image')
        .innerJoinAndSelect('listing.account', 'account')
        .innerJoin('account.users', 'u')
        .leftJoinAndSelect('listing.offers', 'offers')
        .leftJoinAndSelect('listing.listing_status', 'lStatus')
        .leftJoinAndSelect('offers.account', 'oAccount')
        .leftJoinAndSelect('offers.status', 'status')
        .where('account.id = :accountId', {
            accountId: Number(aId),
        })
        .andWhere('u.cognito_user_id = :userId', { userId: userId })
        .getMany();

    if (myListings?.length > 0) {
        return myListings;
    }
    return { statusCode: 204 };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
