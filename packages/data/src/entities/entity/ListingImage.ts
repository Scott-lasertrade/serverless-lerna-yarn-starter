import { Entity, ManyToOne } from 'typeorm';
import { Listing } from './Listing';
import { ImageEntity } from '../utils/ImageEntity';

@Entity('listing_image')
export class ListingImage extends ImageEntity {
    @ManyToOne(() => Listing, (listing) => listing.listing_images, {
        onDelete: 'CASCADE',
    })
    listing: Listing;
}
