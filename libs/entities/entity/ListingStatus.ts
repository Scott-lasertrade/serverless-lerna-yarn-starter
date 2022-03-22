import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Listing } from './Listing';

@Entity('listing_status')
export class ListingStatus extends CommonEntity {
    @Column({ length: 16 })
    name: string;

    @OneToMany(() => Listing, (listing) => listing.listing_status)
    listings: Listing[];
}
