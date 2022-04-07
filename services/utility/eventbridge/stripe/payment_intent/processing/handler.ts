import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { AppError } from '@medii/common';
import { handleTimeout } from '@medii/api-lambda';
import { Database, Listing, ListingStatus } from '@medii/data';
import { sendToEventBridge } from '@medii/eventbridge';

const database = new Database();

const task: any = async (event) => {
    console.log(
        `STRIPE| PROCESSING - PI[${event?.detail?.data?.object?.id}]...`
    );
    const dbConn = await database.getConnection();

    if (!event?.detail?.data?.object?.id) {
        throw new AppError('Recieved bad payment intent', 400);
    }

    await dbConn.transaction(async (transactionalEntityManager) => {
        console.log(`STRIPE| PROCESSING, find related listings...`);
        const relatedListings = await transactionalEntityManager
            .createQueryBuilder(Listing, 'l')
            .innerJoin('l.orders', 'ord')
            .leftJoin('ord.transactions', 't')
            .leftJoin('ord.checkout', 'checkout')
            .leftJoin('checkout.transaction', 'tran')
            .where('t.stripe_pi_id = :transactionId', {
                transactionId: event.detail.data.object.id,
            })
            .orWhere(`tran.stripe_pi_id = :transactionId`, {
                transactionId: event.detail.data.object.id,
            })
            .getMany();

        console.log(
            `STRIPE| PROCESSING, found related listings`,
            relatedListings
        );

        const pendingStatus = await transactionalEntityManager
            .createQueryBuilder(ListingStatus, 'ls')
            .where('ls.name = :status', {
                status: 'Pending Sale',
            })
            .getOneOrFail();

        relatedListings.map((listing) => {
            listing.listing_status = pendingStatus;
        });

        console.log('LISTINGS| Update Listing Status...', relatedListings);
        await transactionalEntityManager
            .getRepository(Listing)
            .save(relatedListings);
        console.log('LISTINGS| Updated.');
    });

    let params;
    try {
        params = {
            id: 'stripe_payment_intent|processing',
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

    const response = {
        statusCode: 200,
    };
    return response;
};

export const main = async (event, context) => {
    try {
        console.log(event);
        return await handleTimeout(task(event, context), context);
    } catch (e) {
        if (e instanceof Error) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: e.message ? e.message : e,
                }),
            };
        } else {
            return {
                statusCode: 400,
                body: e,
            };
        }
    }
};
