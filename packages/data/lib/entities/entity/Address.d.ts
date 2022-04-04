import { Country } from './Country';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { AddressType } from './AddressType';
import { Account } from './Account';
import { Listing } from './Listing';
import { OrderBuyerDetails } from './OrderBuyerDetails';
export declare class Address extends VersionControlledEntity {
    country: Country;
    address_type: AddressType;
    state: string;
    post_code: string;
    address_line_1: string;
    address_line_2: string;
    suburb: string;
    account: Account;
    listing: Listing;
    order_buyer_details: OrderBuyerDetails;
}
//# sourceMappingURL=Address.d.ts.map