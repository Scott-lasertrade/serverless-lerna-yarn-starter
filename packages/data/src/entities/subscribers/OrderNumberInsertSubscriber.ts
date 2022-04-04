import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    EntityManager,
} from 'typeorm';
import { Order } from '../entity/Order';
import { OrderHistory } from '../entity/OrderHistory';

@EventSubscriber()
export class OrderNumberInsertSubscriber
    implements EntitySubscriberInterface<Order>
{
    listenTo() {
        return Order;
    }

    async afterInsert(event: InsertEvent<Order>) {
        const now = new Date();
        event.entity.order_number = `ORD${now
            .toISOString()
            .split('T')[0]
            .split('-')
            .join('')}${event.entity.id}`;
        const newOrder = await event.manager
            .getRepository(Order)
            .save(event.entity);

        await this.addHistory(newOrder, event.manager);
    }

    async addHistory(entity: Order, entityManager: EntityManager) {
        let orderHistory = new OrderHistory();
        orderHistory.order = entity;
        orderHistory.listing = entity.listing;
        orderHistory.status = entity.status;
        orderHistory.buyer = entity.buyer;
        orderHistory.checkout = entity.checkout;
        orderHistory.order_number = entity.order_number;
        orderHistory.total = entity.total;
        orderHistory.paid = entity.paid;
        orderHistory.deposit = entity.deposit;
        orderHistory.fixed_fee = entity.fixed_fee;
        orderHistory.variable_fee = entity.variable_fee;
        await entityManager.getRepository(OrderHistory).save(orderHistory);
    }

    async afterUpdate(event: UpdateEvent<Order>) {
        console.log('EventSubscriber History->Order Update Triggered');
        await this.addHistory(event.entity as Order, event.manager);
    }
}
