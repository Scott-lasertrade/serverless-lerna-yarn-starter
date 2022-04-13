import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing, User } from '@medii/data';
import { addHSDeal } from '@medii/hubspot';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const {
        userId,
        listingId,
        amount,
        buyerName,
        buyerPhone,
        buyerAddress,
        domain,
    } = event.body;

    const dbConn = await database.getConnection();

    // S.Y - Note when we have multiple users for an account this will not work...
    const listing = await dbConn
        .createQueryBuilder(Listing, 'l')
        .innerJoinAndSelect('l.product', 'p')
        .innerJoinAndSelect('l.account', 'a')
        .innerJoinAndSelect('l.address', 'addr')
        .innerJoinAndSelect('addr.country', 'c')
        .innerJoinAndSelect('a.users', 'u')
        .where('l.id = :listingId', {
            listingId: Number(listingId),
        })
        .getOneOrFail();

    const seller = listing.account.users[0];
    const sellerAddress = `${
        listing.address.address_line_2
            ? listing.address.address_line_2 + ' '
            : ''
    }${listing?.address.address_line_1 ?? ''}, ${
        listing?.address?.suburb ?? ''
    }, ${listing?.address?.state ?? ''}, ${
        listing?.address?.post_code ?? ''
    }, ${listing?.address?.country?.name ?? ''}`;

    const buyer = await dbConn
        .createQueryBuilder(User, 'u')
        .where('u.id = :userId', {
            userId: Number(userId),
        })
        .getOneOrFail();

    const hsDeal = await addHSDeal(
        buyer.hubspot_user_id,
        buyerName,
        buyerPhone,
        buyerAddress,
        seller.hubspot_user_id,
        sellerAddress,
        amount,
        `${listing.YOM.toString()} ${listing.product.name} (${listing.id})`,
        `${domain}/product/${listing.product.id}/listing/${listing.id}`
    );

    return hsDeal;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
