import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { AppError } from '@medii/common';
import {
    Database,
    LiveListingsSearchView,
    LiveListingsFuzzySearchView,
    LiveListingsAdvancedView,
    ImportantDate,
} from '@medii/data';
import { sendToEventBridge } from '@medii/eventbridge';

const database = new Database();
const delayPeriod = 3;

export async function main(event: any) {
    const { timeInitiated } = event;
    const importantDateName = 'Listing_Views_Refreshed';

    const dbConn = await database.getConnection();

    let importantDate = await dbConn
        .createQueryBuilder(ImportantDate, 'i')
        .where('i.name = :refreshViewsName', {
            refreshViewsName: importantDateName,
        })
        .getOne();

    if (!importantDate) {
        importantDate = new ImportantDate();
        importantDate.iteration = 0;
        importantDate.name = importantDateName;
    }

    if (
        !importantDate.run_started ||
        importantDate.run_started.getTime() < timeInitiated
    ) {
        if (importantDate.run_ended < importantDate.run_started) {
            console.log(
                `Currently Running, schedule re-run in ${delayPeriod} seconds: `,
                importantDate.run_started.getTime()
            );
            try {
                const params = {
                    id: 'refresh_listing_views',
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
                    throw new AppError(
                        `EVENT BRIDGE| Error: ${err.message}`,
                        400
                    );
                } else {
                    console.error(`EVENT BRIDGE| Unexpected Error: ${err}`);
                    throw new AppError(
                        `EVENT BRIDGE| Unexpected Error: ${err}`,
                        400
                    );
                }
            }
        } else {
            importantDate.iteration += 1;
            let now = new Date().toISOString();
            importantDate.run_started = new Date(now);
            await dbConn.getRepository(ImportantDate).save(importantDate);
            console.log('Rebuilding materialized views...');
            await dbConn
                .getRepository(LiveListingsSearchView)
                .query('REFRESH MATERIALIZED VIEW live_listings_search_view');
            console.log('Rebuilt LiveListingsSearchView.');
            await dbConn
                .getRepository(LiveListingsFuzzySearchView)
                .query(
                    'REFRESH MATERIALIZED VIEW live_listings_fuzzy_search_view'
                );
            console.log('Rebuilt LiveListingsFuzzySearchView.');
            await dbConn
                .getRepository(LiveListingsAdvancedView)
                .query('REFRESH MATERIALIZED VIEW live_listings_advanced_view');
            console.log('Rebuilt LiveListingsAdvancedView.');
            now = new Date().toISOString();
            importantDate.run_ended = new Date(now);
            await dbConn.getRepository(ImportantDate).save(importantDate);
            console.log('All views rebuilt.');
        }
    } else {
        console.log(
            'Not required, updated recently: ',
            importantDate.run_started.getTime()
        );
    }
    const response = {
        statusCode: 200,
    };
    return response;
}
