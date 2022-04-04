import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { LineItemType } from './OrderLineItemType';
import { Order } from './Order';
export declare class LineItem extends VersionControlledEntity {
    title: string;
    price: number;
    type: LineItemType;
    order: Order;
}
//# sourceMappingURL=OrderLineItem.d.ts.map