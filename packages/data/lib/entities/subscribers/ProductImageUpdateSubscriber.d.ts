import { EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { ProductImage } from '../entity/ProductImage';
export declare class ProductImageUpdateSubscriber implements EntitySubscriberInterface<ProductImage> {
    listenTo(): typeof ProductImage;
    afterInsert(event: InsertEvent<ProductImage>): Promise<void>;
    afterUpdate(event: UpdateEvent<ProductImage>): Promise<void>;
    afterRemove(event: RemoveEvent<ProductImage>): Promise<void>;
}
//# sourceMappingURL=ProductImageUpdateSubscriber.d.ts.map