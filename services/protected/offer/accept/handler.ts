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
    if (!Number(event.pathParameters.oId)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.oId}`,
            400
        );
    }
    const oId = Number(event.pathParameters.oId);
    const version = event.body.version;
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;
    let acceptedOffer = new Offer();
    let dbConn = await database.getConnection();

    await dbConn.transaction(async (transactionalEntityManager) => {
        let offer = await transactionalEntityManager
            .createQueryBuilder(Offer, 'o')
            .leftJoinAndSelect('o.status', 'os')
            .where('o.id = :id', {
                id: oId,
            })
            .getOneOrFail();
        offer.version = version;

        //Email Section
        let offerView =
            (await transactionalEntityManager
                .createQueryBuilder(OfferRelationView, 'orv')
                .where('orv.offer_id = :id', {
                    id: offer.id,
                })
                .getOne()) ?? new OfferRelationView();

        if (offerView.seller_id === userId) {
            //The Seller Accepted the Offer, Message to the Buyer
            offer.status = await transactionalEntityManager
                .createQueryBuilder(OfferStatus, 'os')
                .where('os.name = :status', {
                    status: 'Offer accepted',
                })
                .getOneOrFail();
        } else if (offerView.buyer_id === userId) {
            //The Buyer Accepted the Offer, Message to the Seller
            offer.status = await transactionalEntityManager
                .createQueryBuilder(OfferStatus, 'os')
                .where('os.name = :status', {
                    status: 'Offer accepted',
                })
                .getOneOrFail();
        } else {
            if (offerView.buyer_id && offerView.seller_id) {
                console.error(
                    `ACCEPT OFFER| Error - User [${userId}] is neither the buyer [${offerView.buyer_id}] nor seller [${offerView.seller_id}]`
                );
                throw new AppError('This offer does not belong to you', 400);
            } else {
                console.error(
                    `ACCEPT OFFER| Error - Offer has detached from buyer [${offerView.buyer_id}] or seller [${offerView.seller_id}]`
                );
                throw new AppError('Something went wrong...', 400);
            }
        }
        offer.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;

        acceptedOffer = await transactionalEntityManager
            .getRepository(Offer)
            .save(offer);
    });

    const params = {
        id: 'accept_offer',
        type: 'offer_accepted',
        offerId: acceptedOffer.id,
        offerValue: acceptedOffer.value,
        userId: userId,
    };
    console.log(`EVENT BRIDGE| Starting...`, params);
    await sendToEventBridge(
        process.env.EVENT_BRIDGE_EMAIL ?? '',
        params,
        process.env.STAGE ?? ''
    );
    return acceptedOffer;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);

    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
