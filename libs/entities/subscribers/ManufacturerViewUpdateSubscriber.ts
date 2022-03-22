import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm';
import {
    Manufacturer,
    ManufacturerSearchView,
    ManufacturerFuzzySearchView,
} from '@entities';
import { ProductSearchView } from '../views/materialized/ProductSearchView';
import { ProductFuzzySearchView } from '../views/materialized/ProductFuzzySearchView';
import { LiveListingsSearchView } from '../views/materialized/LiveListingsSearchView';
import { LiveListingsFuzzySearchView } from '../views/materialized/LiveListingsFuzzySearchView';

@EventSubscriber()
export class ManufacturerViewUpdateSubscriber
    implements EntitySubscriberInterface<Manufacturer>
{
    listenTo() {
        return Manufacturer;
    }

    async afterInsert(event: InsertEvent<Manufacturer>) {
        await event.manager
            .getRepository(ManufacturerSearchView)
            .query('REFRESH MATERIALIZED VIEW manufacturer_search_view');
        await event.manager
            .getRepository(ManufacturerFuzzySearchView)
            .query('REFRESH MATERIALIZED VIEW manufacturer_fuzzy_search_view');
    }

    async afterUpdate(event: UpdateEvent<Manufacturer>) {
        await event.manager
            .getRepository(ManufacturerSearchView)
            .query('REFRESH MATERIALIZED VIEW manufacturer_search_view');
        await event.manager
            .getRepository(ManufacturerFuzzySearchView)
            .query('REFRESH MATERIALIZED VIEW manufacturer_fuzzy_search_view');
        await event.manager
            .getRepository(ProductSearchView)
            .query('REFRESH MATERIALIZED VIEW product_search_view');
        await event.manager
            .getRepository(ProductFuzzySearchView)
            .query('REFRESH MATERIALIZED VIEW product_fuzzy_search_view');
        await event.manager
            .getRepository(LiveListingsSearchView)
            .query('REFRESH MATERIALIZED VIEW live_listings_search_view');
        await event.manager
            .getRepository(LiveListingsSearchView)
            .query('REFRESH MATERIALIZED VIEW live_listings_advanced_view');
        await event.manager
            .getRepository(LiveListingsFuzzySearchView)
            .query('REFRESH MATERIALIZED VIEW live_listings_fuzzy_search_view');
    }

    async afterRemove(event: RemoveEvent<Manufacturer>) {
        await event.manager
            .getRepository(ManufacturerSearchView)
            .query('REFRESH MATERIALIZED VIEW manufacturer_search_view');
        await event.manager
            .getRepository(ManufacturerFuzzySearchView)
            .query('REFRESH MATERIALIZED VIEW manufacturer_fuzzy_search_view');
    }
}
