import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm';
import { Product, ProductSearchView, ProductFuzzySearchView } from '@entities';
import { LiveListingsFuzzySearchView } from '../views/materialized/LiveListingsFuzzySearchView';
import { LiveListingsSearchView } from '../views/materialized/LiveListingsSearchView';

@EventSubscriber()
export class ProductViewUpdateSubscriber
    implements EntitySubscriberInterface<Product>
{
    listenTo() {
        return Product;
    }

    async afterInsert(event: InsertEvent<Product>) {
        await event.manager
            .getRepository(ProductSearchView)
            .query('REFRESH MATERIALIZED VIEW product_search_view');
        await event.manager
            .getRepository(ProductFuzzySearchView)
            .query('REFRESH MATERIALIZED VIEW product_fuzzy_search_view');
    }

    async afterUpdate(event: UpdateEvent<Product>) {
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
            .getRepository(LiveListingsFuzzySearchView)
            .query('REFRESH MATERIALIZED VIEW live_listings_fuzzy_search_view');
        await event.manager
            .getRepository(LiveListingsSearchView)
            .query('REFRESH MATERIALIZED VIEW live_listings_advanced_view');
    }

    async afterRemove(event: RemoveEvent<Product>) {
        await event.manager
            .getRepository(ProductSearchView)
            .query('REFRESH MATERIALIZED VIEW product_search_view');
        await event.manager
            .getRepository(ProductFuzzySearchView)
            .query('REFRESH MATERIALIZED VIEW product_fuzzy_search_view');
    }
}
