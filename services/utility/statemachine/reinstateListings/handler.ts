import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { AppError } from '@medii/common';
import { Database, Listing, ListingStatus } from '@medii/data';
import { sendToEventBridge } from '@medii/eventbridge';
import Stripe from 'stripe';

const database = new Database();
const stripe = new Stripe(process.env.STRIPESECRETKEY ?? '', {
    apiVersion: '2020-08-27',
});

export async function main(event: any) {
    const { listings, transactionId } = event;
    console.log(event);
    let relatedListings: Listing[];
    const restart = false;

    if (listings?.length > 0) {
        const dbConn = await database.getConnection();

        await dbConn.transaction(async (transactionalEntityManager) => {
            const paymentIntent = await stripe.paymentIntents.retrieve(
                transactionId
            );

            if (
                paymentIntent.status !== 'succeeded' &&
                paymentIntent.status !== 'processing'
            ) {
                const orderListings = await transactionalEntityManager
                    .createQueryBuilder(Listing, 'l')
                    .innerJoinAndSelect('l.listing_status', 'ls')
                    .innerJoin('l.orders', 'ord')
                    .innerJoin('ord.transactions', 't')
                    .where('t.stripe_pi_id = :transactionId', {
                        transactionId: transactionId,
                    })
                    .andWhere('l.id in(:...ids)', {
                        ids: listings.map((l) => l.id),
                    })
                    .andWhere('ls.name = :pendingSaleStatus', {
                        pendingSaleStatus: 'Pending Sale',
                    })
                    .getMany();
                console.log('ORDER LISTINGS', orderListings);

                const checkoutListings = await transactionalEntityManager
                    .createQueryBuilder(Listing, 'l')
                    .innerJoinAndSelect('l.listing_status', 'ls')
                    .innerJoin('l.orders', 'ord')
                    .innerJoin('ord.checkout', 'checkout')
                    .innerJoin('checkout.transaction', 't')
                    .where('t.stripe_pi_id = :transactionId', {
                        transactionId: transactionId,
                    })
                    .andWhere('l.id in(:...ids)', {
                        ids: listings.map((l) => l.id),
                    })
                    .andWhere('ls.name = :pendingSaleStatus', {
                        pendingSaleStatus: 'Pending Sale',
                    })
                    .getMany();
                console.log('CHECKOUT LISTINGS', checkoutListings);

                relatedListings = [...orderListings, ...checkoutListings];

                const listedStatus = await transactionalEntityManager
                    .createQueryBuilder(ListingStatus, 'ls')
                    .where('ls.name = :status', {
                        status: 'Listed',
                    })
                    .getOneOrFail();

                if (relatedListings?.length > 0) {
                    relatedListings.map((listing) => {
                        listing.listing_status = listedStatus;
                    });
                    console.log(
                        'LISTINGS| Update Listing Status...',
                        relatedListings
                    );
                    relatedListings = await transactionalEntityManager
                        .getRepository(Listing)
                        .save(relatedListings);
                    console.log('LISTINGS| Updated.');
                }

                let params;
                try {
                    params = {
                        id: 'reinstate_listings',
                        type: 'refresh_listings',
                    };
                    console.log(`EVENT BRIDGE| Starting...`, params);
                    await sendToEventBridge(
                        process.env.EVENT_BRIDGE ?? '',
                        params,
                        process.env.STAGE ?? ''
                    );
                } catch (err: any) {
                    console.log(`EVENT BRIDGE| Error: ${err.message}`);
                    throw new AppError(
                        `EVENT BRIDGE| Error: ${err.message}`,
                        400
                    );
                }
            } else {
                console.log(
                    'REINSTATE| Payment status at invalid status:',
                    paymentIntent.status
                );
            }
        });

        const response = {
            statusCode: 200,
            body: JSON.stringify({ restart }),
        };
        return response;
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `No listings attached to reinstate.`,
            }),
        };
    }
}
