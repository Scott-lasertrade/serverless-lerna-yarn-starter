import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Account } from './Account';
import { Checkout } from './Checkout';
import { Listing } from './Listing';
import { Order } from './Order';
import { OrderStatus } from './OrderStatus';

@Entity('order_history')
export class OrderHistory extends CommonEntity {
    @ManyToOne(() => Order, (order) => order.history, {
        nullable: true,
    })
    order: Order;
    // FKS
    @ManyToOne(() => Listing, (listing) => listing.orders)
    listing: Listing;

    @ManyToOne(() => OrderStatus, (orderStatus) => orderStatus.orders)
    status: OrderStatus;

    @ManyToOne(() => Account, (account) => account.orders_bought)
    buyer: Account;

    @ManyToOne(() => Checkout, (checkout) => checkout.orders, {
        onDelete: 'CASCADE',
    })
    checkout: Checkout;

    // COLUMNS
    @Column({ nullable: true })
    order_number: string;

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    total: number;

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    paid: number;

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    deposit: number;

    // Hard number ($500.00)
    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    fixed_fee: number;

    // % fee
    @Column('decimal', { precision: 3, scale: 0, default: 11 })
    variable_fee: number;
}
