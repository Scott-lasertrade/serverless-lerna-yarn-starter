import { Entity, Column, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Listing } from './Listing';
import { Transaction } from './Transaction';
import { LineItem } from './OrderLineItem';
import { OrderStatus } from './OrderStatus';
import { Account } from './Account';
import { Checkout } from './Checkout';
import { CommonEntity } from '../utils/CommonEntity';
import { OrderHistory } from './OrderHistory';

@Entity('order')
@Unique(['order_number'])
export class Order extends CommonEntity {
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

    // EXTERNAL JOINS
    @OneToMany(() => LineItem, (lineItem) => lineItem.order)
    line_items: LineItem[];

    @OneToMany(() => Transaction, (transaction) => transaction.order)
    transactions: Transaction[];

    @OneToMany(() => OrderHistory, (order_history) => order_history.order)
    history: OrderHistory[];
}
