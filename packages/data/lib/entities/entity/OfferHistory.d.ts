import { Offer } from './Offer';
import { OfferStatus } from './OfferStatus';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
export declare class OfferHistory extends VersionControlledEntity {
    date: Date;
    offer: Offer;
    value: Number;
    status: OfferStatus;
    info: string;
}
//# sourceMappingURL=OfferHistory.d.ts.map