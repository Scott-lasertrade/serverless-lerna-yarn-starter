import { EntitySubscriberInterface, InsertEvent, UpdateEvent, EntityManager } from 'typeorm';
import { Order } from '../entity/Order';
export declare class OrderNumberInsertSubscriber implements EntitySubscriberInterface<Order> {
    listenTo(): typeof Order;
    afterInsert(event: InsertEvent<Order>): Promise<void>;
    addHistory(entity: Order, entityManager: EntityManager): Promise<void>;
    afterUpdate(event: UpdateEvent<Order>): Promise<void>;
}
//# sourceMappingURL=OrderNumberInsertSubscriber.d.ts.map