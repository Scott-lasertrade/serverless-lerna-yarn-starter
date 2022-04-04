import { EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { Manufacturer } from '../entity/Manufacturer';
export declare class ManufacturerViewUpdateSubscriber implements EntitySubscriberInterface<Manufacturer> {
    listenTo(): typeof Manufacturer;
    afterInsert(event: InsertEvent<Manufacturer>): Promise<void>;
    afterUpdate(event: UpdateEvent<Manufacturer>): Promise<void>;
    afterRemove(event: RemoveEvent<Manufacturer>): Promise<void>;
}
//# sourceMappingURL=ManufacturerViewUpdateSubscriber.d.ts.map