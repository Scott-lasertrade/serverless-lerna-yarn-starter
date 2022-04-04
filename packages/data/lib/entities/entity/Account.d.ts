import { Address } from './Address';
import { Offer } from './Offer';
import { Listing } from './Listing';
import { Question } from './Question';
import { User } from './User';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Order } from './Order';
import { Watchlist } from './Watchlist';
import { CartItem } from './CartItem';
export declare class Account extends VersionControlledEntity {
    users: User[];
    account_type: string;
    stripe_user_id: string;
    business_name: string;
    business_phone_number: string;
    legal_name: string;
    is_status_approved: boolean;
    structure: string;
    tax_id: string;
    category: string;
    hubspot_company_id: string;
    address: Address;
    listings: Listing[];
    offers: Offer[];
    watchlists: Watchlist[];
    orders_bought: Order[];
    questions: Question[];
    cart_items: CartItem[];
}
//# sourceMappingURL=Account.d.ts.map