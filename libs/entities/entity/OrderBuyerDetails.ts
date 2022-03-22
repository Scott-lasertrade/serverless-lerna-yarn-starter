import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Address } from './Address';
import { Checkout } from './Checkout';

@Entity('order_buyer_details')
export class OrderBuyerDetails extends VersionControlledEntity {
    // FKS
    @OneToOne(() => Checkout, (order) => order.buyer_details)
    @JoinColumn()
    checkout: Checkout;

    @OneToOne(() => Address)
    @JoinColumn()
    address: Address;

    // COLUMNS
    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    business_name: string;

    @Column()
    tax_id: string;

    // EXTERNAL JOINS
}
