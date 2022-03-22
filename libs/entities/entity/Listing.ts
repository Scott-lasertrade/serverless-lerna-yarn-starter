import {
    Entity,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Account } from './Account';
import { Address } from './Address';
import { Offer } from './Offer';
import { CurrencyType } from './CurrencyType';
import { ListingAccessory } from './ListingAccessory';
import { ListingImage } from './ListingImage';
import { Product } from './Product';
import { Question } from './Question';
import { Usage } from './Usage';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Watchlist } from '@entities';
import { ListingStatus } from './ListingStatus';
import { Order } from './Order';
import { CartItem } from './CartItem';

@Entity('listing')
export class Listing extends VersionControlledEntity {
    // FKS
    @ManyToOne(() => CurrencyType, (currencyType) => currencyType.listings, {
        nullable: true,
    })
    currency_type: CurrencyType;

    @ManyToOne(() => Account, (account) => account.listings, {
        onDelete: 'CASCADE',
    })
    account: Account;

    @ManyToOne(() => ListingStatus, (listing_status) => listing_status.listings)
    listing_status: ListingStatus;

    @ManyToOne(() => Product, (product) => product.listings, {
        onDelete: 'CASCADE',
    })
    product: Product;

    @OneToOne(() => Address)
    @JoinColumn()
    address: Address;

    @OneToOne(() => Usage, {
        cascade: true,
    })
    @JoinColumn()
    usage: Usage;

    // COLUMNS
    @Column({ nullable: true })
    serial_number: string;

    @Column({ nullable: true })
    YOM: number;

    @Column('text', { nullable: true })
    comment: string;

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    cost: number;

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    reject_below: number;

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    accept_above: number;

    @Column({ nullable: true })
    is_on_ground_floor: boolean;

    @Column({ nullable: true })
    is_there_steps: boolean;

    @Column({ nullable: true })
    is_packaging_required: boolean;

    // EXTERNAL JOINS
    @OneToMany(
        () => ListingAccessory,
        (listing_accessory) => listing_accessory.listing,
        {
            cascade: true,
        }
    )
    listing_accessories: ListingAccessory[];

    @OneToMany(() => ListingImage, (listingImage) => listingImage.listing, {
        cascade: true,
    })
    listing_images: ListingImage[];

    @OneToMany(() => Offer, (offer) => offer.listing, {
        cascade: true,
    })
    offers: Offer[];

    @OneToMany(() => Watchlist, (watchlist) => watchlist.listing, {
        cascade: true,
    })
    watchlists: Watchlist[];

    @OneToMany(() => CartItem, (cartItem) => cartItem.listing, {
        cascade: true,
    })
    cart_items: CartItem[];

    @OneToMany(() => Order, (order) => order.listing, {
        cascade: true,
    })
    orders: Order[];

    @OneToMany(() => Question, (question) => question.listing, {
        cascade: true,
    })
    questions: Question[];
}
