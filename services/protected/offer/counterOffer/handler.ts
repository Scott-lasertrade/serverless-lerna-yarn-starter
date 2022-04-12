import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Offer, OfferStatus, OfferRelationView } from '@medii/data';
import { AppError } from '@medii/common';
import { sendToEventBridge } from '@medii/eventbridge';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.id)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const id = Number(event.pathParameters.id);
    const value = event.body.value;
    const version = event.body.version;
    const expire_on = event.body.expire_on
        ? new Date(event.body.expire_on)
        : new Date(new Date().getTime() + Number(process.env.DEFAULT_EXPIRY));
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;

    let dbConn = await database.getConnection();
    let new_offer = new Offer();

    await dbConn.transaction(async (transactionalEntityManager) => {
        let offer = await dbConn
            .createQueryBuilder(Offer, 'o')
            .innerJoinAndSelect('o.status', 'os')
            .where('o.id = :id', {
                id: id,
            })
            .getOneOrFail();
        offer.value = value;
        offer.version = version;
        offer.offer_expiry_date = expire_on;

        //Email Section
        let offerView =
            (await dbConn
                .createQueryBuilder(OfferRelationView, 'orv')
                .where('orv.offer_id = :id', {
                    id: offer.id,
                })
                .getOne()) ?? new OfferRelationView();

        if (offerView.seller_id === userId) {
            offer.status = await dbConn
                .createQueryBuilder(OfferStatus, 'os')
                .where('os.name = :status', {
                    status: 'Seller countered offer',
                })
                .getOneOrFail();
        } else if (offerView.buyer_id === userId) {
            offer.offers_towards_limit = offer.offers_towards_limit + 1;
            offer.status = await dbConn
                .createQueryBuilder(OfferStatus, 'os')
                .where('os.name = :status', {
                    status: 'Buyer countered offer',
                })
                .getOneOrFail();
        } else {
            if (offerView.buyer_id && offerView.seller_id) {
                console.error(
                    `COUNTER OFFER| Error - User [${userId}] is neither the buyer [${offerView.buyer_id}] nor seller [${offerView.seller_id}]`
                );
                throw new AppError('This offer does not belong to you', 400);
            } else {
                console.error(
                    `COUNTER OFFER| Error - Offer has detached from buyer [${offerView.buyer_id}] or seller [${offerView.seller_id}]`
                );
                throw new AppError('Something went wrong...', 400);
            }
        }
        offer.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;

        new_offer = await transactionalEntityManager
            .getRepository(Offer)
            .save(offer);
    });

    // Set up email
    try {
        const params = {
            id: 'counter_offer',
            type: 'offer_countered',
            offerId: new_offer.id,
            offerValue: new_offer.value,
            userId: userId,
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
            id: 'counter_offer',
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
