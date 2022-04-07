import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { AppError } from '@medii/common';
import { Database, Offer, OfferStatus } from '@medii/data';
import { sendToEventBridge } from '@medii/eventbridge';

const database = new Database();

export async function main(event: any) {
    const { offer_id, offer_status_id, expire_on } = event;
    let offerPreviousStatus: OfferStatus;

    if (
        !Number(offer_id) ||
        !Number(offer_status_id) ||
        !Date.parse(expire_on)
    ) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Invalid parameters provided: { offer_id: [${offer_id}], offer_status_id: [${offer_status_id}], expire_on: [${expire_on} ]}`,
            }),
        };
    }

    const dbConn = await database.getConnection();
    let offer =
        (await dbConn
            .createQueryBuilder(Offer, 'o')
            .leftJoinAndSelect('o.status', 'os')
            .where('o.id = :id', {
                id: Number(offer_id),
            })
            .getOne()) ?? new Offer();

    if (
        offer.offer_expiry_date.getTime() === new Date(expire_on).getTime() &&
        (offer.status.name === 'Offer made' ||
            offer.status.name === 'Seller countered offer' ||
            offer.status.name === 'Buyer countered offer')
    ) {
        offerPreviousStatus = offer.status;
        await dbConn.transaction(async (transactionalEntityManager) => {
            const offerExpiredStatus = await transactionalEntityManager
                .createQueryBuilder(OfferStatus, 'os')
                .where('os.name = :status', {
                    status: 'Offer expired',
                })
                .getOneOrFail();

            offer.status = offerExpiredStatus;
            offer = await transactionalEntityManager
                .getRepository(Offer)
                .save(offer);
        });

        try {
            const params = {
                id: 'expire_offer',
                type: 'offer_timeout',
                offerId: offer_id,
                offerStatus: offerPreviousStatus.name,
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
                throw new AppError(
                    `EVENT BRIDGE| Unexpected Error: ${err}`,
                    400
                );
            }
        }
    } else {
        let problem = '';
        if (offer.offer_expiry_date != new Date(expire_on)) {
            problem += `| Dates do not match: ${new Date(expire_on)} <> ${
                offer.offer_expiry_date
            }`;
        }
        if (
            offer.status.name !== 'Offer made' &&
            offer.status.name !== 'Seller countered offer' &&
            offer.status.name !== 'Buyer countered offer'
        ) {
            problem += `| Invalid Status: ${offer.status.name}`;
        }
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Unable to update offer - ${problem}`,
            }),
        };
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(offer),
    };
    return response;
}
