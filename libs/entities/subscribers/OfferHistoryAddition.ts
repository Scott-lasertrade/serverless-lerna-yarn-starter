import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { Offer, OfferHistory } from '@entities';

@EventSubscriber()
export class OfferHistoryAddition implements EntitySubscriberInterface<Offer> {
    listenTo() {
        return Offer;
    }

    async afterInsert(event: InsertEvent<Offer>) {
        console.log('EventSubscriber History->Insert Triggered');
        await this.addHistory(event);
    }

    async addHistory(event) {
        let offerHistory = new OfferHistory();
        offerHistory.status = event.entity.status;
        offerHistory.value = event.entity.value;
        offerHistory.date = new Date();
        offerHistory.offer = new Offer(event.entity.id);

        await event.manager.getRepository(OfferHistory).save(offerHistory);
    }

    async afterUpdate(event: UpdateEvent<Offer>) {
        console.log('EventSubscriber History->Update Triggered');
        await this.addHistory(event);
    }
}
