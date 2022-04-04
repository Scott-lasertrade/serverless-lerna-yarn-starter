import { CommonEntity } from '../utils/CommonEntity';
import { Order } from './Order';
import { OrderBuyerDetails } from './OrderBuyerDetails';
import { Transaction } from './Transaction';
export declare class Checkout extends CommonEntity {
    transaction: Transaction;
    buyer_details: OrderBuyerDetails;
    orders: Order[];
}
//# sourceMappingURL=Checkout.d.ts.map