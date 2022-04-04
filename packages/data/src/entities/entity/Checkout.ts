import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Order } from './Order';
import { OrderBuyerDetails } from './OrderBuyerDetails';
import { Transaction } from './Transaction';

@Entity('checkout')
export class Checkout extends CommonEntity {
    // FKS
    @OneToOne(() => Transaction, (transaction) => transaction.checkout)
    @JoinColumn()
    transaction: Transaction;

    // COLUMNS

    // EXTERNAL JOINS
    @OneToOne(
        () => OrderBuyerDetails,
        (orderBuyerDetails) => orderBuyerDetails.checkout
    )
    buyer_details: OrderBuyerDetails;

    @OneToMany(() => Order, (order) => order.checkout, {
        cascade: true,
    })
    orders: Order[];
}
