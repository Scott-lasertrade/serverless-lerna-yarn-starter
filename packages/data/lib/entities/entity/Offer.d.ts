import { Listing } from './Listing';
import { Account } from './Account';
import { OfferStatus } from './OfferStatus';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { OfferHistory } from './OfferHistory';
import { Order } from './Order';
export declare class Offer extends VersionControlledEntity {
    value: number;
    offers_towards_limit: number;
    listing: Listing;
    account: Account;
    status: OfferStatus;
    offer_expiry_date: Date;
    offer_history: OfferHistory[];
    order: Order;
}
//# sourceMappingURL=Offer.d.ts.map