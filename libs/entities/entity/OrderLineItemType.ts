import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { LineItem } from './OrderLineItem';

@Entity('order_line_item_type')
@Unique(['name'])
export class LineItemType extends CommonEntity {
    @Column()
    name: string;

    @OneToMany(() => LineItem, (lineItem) => lineItem.type)
    line_items: LineItem[];
}
