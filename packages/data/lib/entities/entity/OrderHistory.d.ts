import { CommonEntity } from '../utils/CommonEntity';
import { Account } from './Account';
import { Checkout } from './Checkout';
import { Listing } from './Listing';
import { Order } from './Order';
import { OrderStatus } from './OrderStatus';
export declare class OrderHistory extends CommonEntity {
    order: Order;
    listing: Listing;
    status: OrderStatus;
    buyer: Account;
    checkout: Checkout;
    order_number: string;
    total: number;
    paid: number;
    deposit: number;
    fixed_fee: number;
    variable_fee: number;
}
//# sourceMappingURL=OrderHistory.d.ts.map