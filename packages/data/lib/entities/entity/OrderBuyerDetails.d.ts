import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Address } from './Address';
import { Checkout } from './Checkout';
export declare class OrderBuyerDetails extends VersionControlledEntity {
    checkout: Checkout;
    address: Address;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    business_name: string;
    tax_id: string;
}
//# sourceMappingURL=OrderBuyerDetails.d.ts.map