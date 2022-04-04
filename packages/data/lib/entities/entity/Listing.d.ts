import { Account } from './Account';
import { Address } from './Address';
import { Offer } from './Offer';
import { CurrencyType } from './CurrencyType';
import { ListingAccessory } from './ListingAccessory';
import { ListingImage } from './ListingImage';
import { Product } from './Product';
import { Question } from './Question';
import { Usage } from './Usage';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Watchlist } from './Watchlist';
import { ListingStatus } from './ListingStatus';
import { Order } from './Order';
import { CartItem } from './CartItem';
export declare class Listing extends VersionControlledEntity {
    currency_type: CurrencyType;
    account: Account;
    listing_status: ListingStatus;
    product: Product;
    address: Address;
    usage: Usage;
    serial_number: string;
    YOM: number;
    comment: string;
    cost: number;
    reject_below: number;
    accept_above: number;
    is_on_ground_floor: boolean;
    is_there_steps: boolean;
    is_packaging_required: boolean;
    listing_accessories: ListingAccessory[];
    listing_images: ListingImage[];
    offers: Offer[];
    watchlists: Watchlist[];
    cart_items: CartItem[];
    orders: Order[];
    questions: Question[];
}
//# sourceMappingURL=Listing.d.ts.map