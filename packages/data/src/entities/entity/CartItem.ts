import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Account } from './Account';
import { Listing } from './Listing';

@Entity('cart_item')
export class CartItem extends CommonEntity {
    // FKS
    @ManyToOne(() => Listing, (listing) => listing.cart_items)
    listing: Listing;

    @ManyToOne(() => Account, (account) => account.cart_items)
    account: Account;

    // COLUMNS
    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    shipping_estimate: number;

    @Column({ default: 1 })
    listing_version: number;

    // EXTERNAL JOINS
}
