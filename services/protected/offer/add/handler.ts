import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Offer, OfferStatus, Listing, Account } from '@medii/data';
import { AppError } from '@medii/common';
import { sendToEventBridge } from '@medii/eventbridge';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const account_id = event.body.account_id;
    const listing_id = event.body.listing_id;
    const value = event.body.value;

    // S.Y. Allow expiry to be passed in, otherwise default to 24h from now
    const expire_on = event.body.expire_on
        ? new Date(event.body.expire_on)
        : new Date(new Date().getTime() + Number(process.env.DEFAULT_EXPIRY));

    let dbConn = await database.getConnection();
    let new_offer = new Offer();

    await dbConn.transaction(async (transactionalEntityManager) => {
        let offer = new Offer();
        offer.listing = new Listing(listing_id);
        offer.value = value;
        offer.account =
            (await transactionalEntityManager
                .createQueryBuilder(Account, 'a')
                .innerJoin('a.users', 'u')
                .where('a.id = :accountId', { accountId: account_id })
                .andWhere('u.cognito_user_id = :userId', {
                    userId:
                        event.headers.currentuserid ??
                        event.headers.CurrentUserId,
                })
                .getOne()) ?? new Account();
        if (!offer.account) {
            throw new AppError(
                'Could not find link between user and account',
                401
            );
        }
        offer.status = await transactionalEntityManager
            .createQueryBuilder(OfferStatus, 'os')
            .where('os.name = :status', {
                status: 'Offer made',
            })
            .getOneOrFail();
        offer.offers_towards_limit = 1;
        offer.offer_expiry_date = expire_on;
        offer.created_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        offer.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        console.log('Saving Offer...', offer);
        new_offer = await transactionalEntityManager
            .getRepository(Offer)
            .save(offer);
    });

    // Set up seller email
    try {
        const params = {
            id: 'offer_add',
            type: 'offer_recieved',
            offerId: new_offer.id,
            offerValue: new_offer.value,
        };
        console.log(`EVENT BRIDGE| Starting...`, params);
        await sendToEventBridge(
            process.env.EVENT_BRIDGE_EMAIL ?? '',
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

    // Set up offer expiry
    try {
        let params = {
            id: 'offer_add',
            type: 'expire_offer',
            offer_id: new_offer.id,
            offer_status_id: new_offer.status.id,
            expire_on: new_offer.offer_expiry_date,
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

    return {
        offer: new_offer,
    };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
