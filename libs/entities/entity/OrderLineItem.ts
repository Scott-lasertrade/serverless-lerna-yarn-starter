import { Entity, Column, ManyToOne } from 'typeorm';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { LineItemType } from './OrderLineItemType';
import { Order } from './Order';

@Entity('order_line_item')
export class LineItem extends VersionControlledEntity {
    @Column()
    title: string;

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    price: number;

    @ManyToOne(() => LineItemType, (type) => type.line_items)
    type: LineItemType;

    @ManyToOne(() => Order, (order) => order.line_items)
    order: Order;
}
