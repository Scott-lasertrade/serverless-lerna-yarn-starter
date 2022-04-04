import { CommonEntity } from '../utils/CommonEntity';
import { Account } from './Account';
import { Listing } from './Listing';
export declare class CartItem extends CommonEntity {
    listing: Listing;
    account: Account;
    shipping_estimate: number;
    listing_version: number;
}
//# sourceMappingURL=CartItem.d.ts.map