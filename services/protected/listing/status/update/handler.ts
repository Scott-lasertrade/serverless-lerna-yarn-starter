import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import {
    Database,
    Listing,
    ListingStatus,
    ListingSellerView,
} from '@medii/data';
import { AppError } from '@medii/common';
import { handelTemplateEmail, getUNAndEmailFromCogId } from '@medii/ses';
import { htmlBody, htmlBodyReject } from './htmlBody';
import { sendToEventBridge } from '@medii/eventbridge';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    // LISTING
    const listing_id = event.body.id;
    const listing_version = event.body.version;
    const listing_status = event.body.status;
    const listing_reason = event.body.reason;

    const dbConn = await database.getConnection();
    let listing: Listing = new Listing();
    await dbConn.transaction(async (transactionalEntityManager) => {
        listing = await transactionalEntityManager
            .createQueryBuilder(Listing, 'l')
            .where('l.id = :id', {
                id: listing_id,
            })
            .getOneOrFail();
        listing.version = listing_version;
        const listingStatus = await transactionalEntityManager
            .createQueryBuilder(ListingStatus, 'ls')
            .where('ls.name = :name', {
                name: listing_status,
            })
            .getOneOrFail();

        listing.listing_status = listingStatus;
        listing.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;

        listing = await transactionalEntityManager
            .getRepository(Listing)
            .save(listing);

        // Email Section
        let listingView = await dbConn
            .createQueryBuilder(ListingSellerView, 'lsv')
            .where('lsv.listing_id = :id', {
                id: listing_id,
            })
            .getOne();
        if (listing.listing_status.name == 'Listed') {
            const UNE = await getUNAndEmailFromCogId(
                listingView?.lister_id ?? ''
            );
            await handelTemplateEmail(
                `Your product listing has been approved`,
                htmlBody(
                    UNE.userName,
                    listingView?.product_name,
                    `${process.env.HOSTING_DOMAIN}/product/${listingView?.product_id}/listing/${listingView?.listing_id}`,
                    `${process.env.HOSTING_DOMAIN}/account/sell/create/listing?pid=${listingView?.product_id}&lid=${listingView?.listing_id}`
                ),
                UNE.emailAddress ?? ''
            );
        }
        if (listing.listing_status.name == 'Rejected') {
            console.log(listing_reason);
            const UNE = await getUNAndEmailFromCogId(
                listingView?.lister_id ?? ''
            );
            await handelTemplateEmail(
                `Please edit your product listing.`,
                htmlBodyReject(
                    UNE.userName,
                    listingView?.product_name,
                    listing_reason,
                    `${process.env.HOSTING_DOMAIN}/product/${listingView?.product_id}/listing/${listingView?.listing_id}`,
                    `${process.env.HOSTING_DOMAIN}/account/sell/create/listing?pid=${listingView?.product_id}&lid=${listingView?.listing_id}`
                ),
                UNE.emailAddress ?? ''
            );
        }
    });

    // StateMachine Section
    try {
        let params = {
            id: 'listing|add_or_update',
            type: 'refresh_listings',
        };
        console.log(`EVENT BRIDGE| Starting...`, params);
        await sendToEventBridge(
            process.env.EVENT_BRIDGE ?? '',
            params,
            process.env.STAGE ?? ''
        );
    } catch (err) {
        if (err instanceof Error) {
            console.error(`EVENT BRIDGE| Error: ${err.message}`);
            throw new AppError(`EVENT BRIDGE| Error: ${err.message}`, 400);
        } else {
            console.error(`EVENT BRIDGE| Unexpected Error: ${err}`);
            throw new AppError(`EVENT BRIDGE| Unexpected Error: ${err}`, 400);
        }
    }
    return listing;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
