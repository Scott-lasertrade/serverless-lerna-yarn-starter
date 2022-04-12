import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Offer, OfferRelationView, OfferStatus } from '@medii/data';
import { AppError } from '@medii/common';
import { handelTemplateEmail, getUNAndEmailFromCogId } from '@medii/ses';
import htmlBody from './htmlBody';
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
    const userId = event.body.CurrentUserId;
    const version = event.body.version;
    let removedOffer = new Offer();
    let dbConn = await database.getConnection();

    await dbConn.transaction(async (transactionalEntityManager) => {
        let offerView =
            (await dbConn
                .createQueryBuilder(OfferRelationView, 'orv')
                .where('orv.offer_id = :id', {
                    id: oId,
                })
                .getOne()) ?? new OfferRelationView();

        if (offerView.seller_id === userId || offerView.buyer_id) {
            const offer = await transactionalEntityManager
                .createQueryBuilder(Offer, 'o')
                .where('o.id = :id', {
                    id: oId,
                })
                .getOneOrFail();
            offer.status = await transactionalEntityManager
                .createQueryBuilder(OfferStatus, 'os')
                .where('os.name = :status', {
                    status: 'Offer cancelled',
                })
                .getOneOrFail();
            offer.version = version;
            offer.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;

            removedOffer = await transactionalEntityManager
                .getRepository(Offer)
                .save(offer);
            //Email Section
            const UNE = await getUNAndEmailFromCogId(offerView.seller_id);
            await handelTemplateEmail(
                `An offer on your ${offerView.product_name} has been cancelled.`,
                htmlBody(
                    UNE.userName,
                    offerView.product_name,
                    `${process.env.HOSTING_DOMAIN}/product/${offerView.product_id}/listing/${offerView.listing_id}`,
                    `${process.env.HOSTING_DOMAIN}/account/offers/${removedOffer.id}`
                ),
                UNE.emailAddress ?? ''
            );
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
    });

    return removedOffer;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
