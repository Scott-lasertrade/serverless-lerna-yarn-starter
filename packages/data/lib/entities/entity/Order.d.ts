import { Listing } from './Listing';
import { Transaction } from './Transaction';
import { LineItem } from './OrderLineItem';
import { OrderStatus } from './OrderStatus';
import { Account } from './Account';
import { Checkout } from './Checkout';
import { CommonEntity } from '../utils/CommonEntity';
import { OrderHistory } from './OrderHistory';
export declare class Order extends CommonEntity {
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
    line_items: LineItem[];
    transactions: Transaction[];
    history: OrderHistory[];
}
//# sourceMappingURL=Order.d.ts.map