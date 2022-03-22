import {
    EventSubscriber,
    EntitySubscriberInterface,
    UpdateEvent,
} from 'typeorm';
import {
    Listing,
    LiveListingsSearchView,
    LiveListingsFuzzySearchView,
} from '@entities';

@EventSubscriber()
export class LiveListingsViewUpdateSubscriber
    implements EntitySubscriberInterface<Listing>
{
    listenTo() {
        return Listing;
    }

    async afterUpdate(event: UpdateEvent<Listing>) {
        // S.Y - TODO: find an efficent way to only update when listing goes from/to live OR
        // Migrate to lambda timed event for updates
        // if (
        //     Number(event.entity?.YOM) &&
        //     event.entity?.YOM.toString().length === 4
        // ) {
        //     await event.manager
        //         .getRepository(LiveListingsSearchView)
        //         .query('REFRESH MATERIALIZED VIEW live_listings_search_view');
        //     await event.manager
        //         .getRepository(LiveListingsSearchView)
        //         .query('REFRESH MATERIALIZED VIEW live_listings_advanced_view');
        //     await event.manager
        //         .getRepository(LiveListingsFuzzySearchView)
        //         .query(
        //             'REFRESH MATERIALIZED VIEW live_listings_fuzzy_search_view'
        //         );
        // }
    }
}
