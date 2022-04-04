import { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { Offer } from '../entity/Offer';
export declare class OfferHistoryAddition implements EntitySubscriberInterface<Offer> {
    listenTo(): typeof Offer;
    afterInsert(event: InsertEvent<Offer>): Promise<void>;
    addHistory(event: any): Promise<void>;
    afterUpdate(event: UpdateEvent<Offer>): Promise<void>;
}
//# sourceMappingURL=OfferHistoryAddition.d.ts.map