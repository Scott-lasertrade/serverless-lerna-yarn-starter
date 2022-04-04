import { EntitySubscriberInterface } from 'typeorm';
import { Listing } from '../entity/Listing';
export declare class LiveListingsViewUpdateSubscriber implements EntitySubscriberInterface<Listing> {
    listenTo(): typeof Listing;
    afterUpdate(): Promise<void>;
}
//# sourceMappingURL=LiveListingsViewUpdateSubscriber.d.ts.map