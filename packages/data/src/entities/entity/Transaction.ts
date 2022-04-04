import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Checkout } from './Checkout';
import { Order } from './Order';
import { TransactionType } from './TransactionType';

@Entity('transaction')
export class Transaction extends VersionControlledEntity {
    // FKS
    @ManyToOne(
        () => TransactionType,
        (transaction_type) => transaction_type.transactions,
        {
            cascade: true,
        }
    )
    type: TransactionType;

    @ManyToOne(() => Order, (order) => order.transactions, {
        cascade: true,
    })
    order: Order;

    // COLUMNS
    @Column()
    stripe_pi_id: string;

    // EXTERNAL JOINS
    @OneToOne(() => Checkout, (checkout) => checkout.transaction, {
        nullable: true,
    })
    checkout: Checkout;
}
