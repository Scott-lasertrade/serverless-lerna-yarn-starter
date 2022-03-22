import { Entity, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Listing } from './Listing';
import { Usage } from './Usage';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Product } from './Product';

@Entity('listing_accessory')
export class ListingAccessory extends VersionControlledEntity {
    // FKS
    @ManyToOne(() => Product, (product) => product.listing_accessories, {
        nullable: true,
    })
    product: Product;

    @ManyToOne(() => Listing, (listing) => listing.listing_accessories, {
        onDelete: 'CASCADE',
    })
    listing: Listing;

    @OneToOne(() => Usage, {
        cascade: true,
    })
    @JoinColumn()
    usage: Usage;

    // COLUMNS

    // EXTERNAL JOINS
}
