import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Checkout } from './Checkout';
import { Order } from './Order';
import { TransactionType } from './TransactionType';
export declare class Transaction extends VersionControlledEntity {
    type: TransactionType;
    order: Order;
    stripe_pi_id: string;
    checkout: Checkout;
}
//# sourceMappingURL=Transaction.d.ts.map