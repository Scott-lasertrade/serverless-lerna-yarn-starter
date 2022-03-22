import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { Listing } from './Listing';
import { Account } from './Account';
import { OfferStatus } from './OfferStatus';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { OfferHistory } from './OfferHistory';
import { Order } from './Order';

@Entity('offer')
export class Offer extends VersionControlledEntity {
    @Column()
    value: number;

    @Column()
    offers_towards_limit: number;

    @ManyToOne(() => Listing, (listing) => listing.offers, {
        nullable: true,
    })
    listing: Listing;

    @ManyToOne(() => Account, (account) => account.offers, {
        nullable: true,
    })
    account: Account;

    @ManyToOne(() => OfferStatus, {
        cascade: true,
    })
    @JoinColumn()
    status: OfferStatus;

    @Column({ type: 'timestamptz', default: '2021-11-23T05:00:30.006Z' })
    offer_expiry_date: Date;

    @OneToMany(() => OfferHistory, (offer_history) => offer_history.offer, {
        cascade: true,
    })
    offer_history: OfferHistory[];

    @OneToOne(() => Order, { nullable: true })
    order: Order;
}
