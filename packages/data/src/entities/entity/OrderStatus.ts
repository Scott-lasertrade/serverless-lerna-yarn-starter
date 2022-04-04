import { Entity, Column, Unique, OneToMany } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Order } from './Order';

@Entity('order_status')
@Unique(['name'])
export class OrderStatus extends CommonEntity {
    @OneToMany(() => Order, (order) => order.status)
    orders: Order[];

    @Column()
    name: string;
}
