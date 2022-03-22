import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm';
import { ProductSearchView, ProductImage } from '@entities';

@EventSubscriber()
export class ProductImageUpdateSubscriber
    implements EntitySubscriberInterface<ProductImage>
{
    listenTo() {
        return ProductImage;
    }

    async afterInsert(event: InsertEvent<ProductImage>) {
        await event.manager
            .getRepository(ProductSearchView)
            .query('REFRESH MATERIALIZED VIEW product_search_view');
    }

    async afterUpdate(event: UpdateEvent<ProductImage>) {
        await event.manager
            .getRepository(ProductSearchView)
            .query('REFRESH MATERIALIZED VIEW product_search_view');
    }

    async afterRemove(event: RemoveEvent<ProductImage>) {
        await event.manager
            .getRepository(ProductSearchView)
            .query('REFRESH MATERIALIZED VIEW product_search_view');
    }
}
