import {
    Entity,
    Column,
    ManyToMany,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Address } from './Address';
import { Offer } from './Offer';
import { Listing } from './Listing';
import { Question } from './Question';
import { User } from './User';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Order } from './Order';
import { Watchlist } from './Watchlist';
import { CartItem } from './CartItem';
// import { Transaction } from './Transaction';

@Entity('account')
export class Account extends VersionControlledEntity {
    // FKS
    @ManyToMany(() => User, (user) => user.accounts)
    users: User[];

    // COLUMNS
    @Column({ length: 32, nullable: true })
    account_type: string;

    @Column({ length: 128, nullable: true })
    stripe_user_id: string;

    @Column({ length: 128, nullable: true })
    business_name: string;

    @Column({ length: 16, nullable: true })
    business_phone_number: string;

    @Column({ length: 128, nullable: true })
    legal_name: string;

    @Column({ nullable: true })
    is_status_approved: boolean;

    @Column({ nullable: true })
    structure: string;

    @Column({ nullable: true })
    tax_id: string;

    @Column({ length: 32, nullable: true })
    category: string;

    @Column({ nullable: true })
    hubspot_company_id: string;

    // EXTERNAL COLUMNS
    @OneToOne(() => Address, (address) => address.account)
    @JoinColumn()
    address: Address;

    @OneToMany(() => Listing, (listing) => listing.account, {
        cascade: true,
    })
    listings: Listing[];

    @OneToMany(() => Offer, (offer) => offer.account, {
        cascade: true,
    })
    offers: Offer[];

    @OneToMany(() => Watchlist, (watchlist) => watchlist.account, {
        cascade: true,
    })
    watchlists: Watchlist[];

    @OneToMany(() => Order, (order) => order.buyer)
    orders_bought: Order[];

    @OneToMany(() => Question, (question) => question.asker, {
        cascade: true,
    })
    questions: Question[];
    @OneToMany(() => CartItem, (cartItem) => cartItem.account, {
        cascade: true,
    })
    cart_items: CartItem[];
}
