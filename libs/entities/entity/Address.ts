import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { Country } from './Country';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { AddressType } from './AddressType';
import { Account, Listing } from '@entities';
import { OrderBuyerDetails } from './OrderBuyerDetails';

@Entity('address')
export class Address extends VersionControlledEntity {
    // FKS
    @ManyToOne(() => Country, (country) => country.addresses, {
        nullable: true,
    })
    country: Country;

    @ManyToOne(() => AddressType, (address_type) => address_type.addresses)
    address_type: AddressType;

    // COLUMNS
    @Column({ length: 50 })
    state: string;

    @Column({ length: 16 })
    post_code: string;

    @Column({ length: 128 })
    address_line_1: string;

    @Column({ length: 128 })
    address_line_2: string;

    @Column({ length: 50 })
    suburb: string;

    // EXTERNAL JOINS
    @OneToOne(() => Account, (account) => account.address)
    account: Account;

    @OneToOne(() => Listing, (listing) => listing.address)
    listing: Listing;

    @OneToOne(
        () => OrderBuyerDetails,
        (order_buyer_details) => order_buyer_details.address
    )
    order_buyer_details: OrderBuyerDetails;
}
