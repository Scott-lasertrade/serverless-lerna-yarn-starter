import { EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { Product } from '../entity/Product';
export declare class ProductViewUpdateSubscriber implements EntitySubscriberInterface<Product> {
    listenTo(): typeof Product;
    afterInsert(event: InsertEvent<Product>): Promise<void>;
    afterUpdate(event: UpdateEvent<Product>): Promise<void>;
    afterRemove(event: RemoveEvent<Product>): Promise<void>;
}
//# sourceMappingURL=ProductViewUpdateSubscriber.d.ts.map