import { Entity, ManyToOne } from 'typeorm';
import { Listing } from './Listing';
import { Account } from './Account';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';

@Entity('watchlist')
export class Watchlist extends VersionControlledEntity {
    @ManyToOne(() => Listing, (listing) => listing.watchlists)
    listing: Listing;

    @ManyToOne(() => Account, (account) => account.watchlists)
    account: Account;
}
