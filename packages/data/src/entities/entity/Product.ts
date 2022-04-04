import {
    Entity,
    Column,
    OneToMany,
    ManyToMany,
    ManyToOne,
    OneToOne,
    JoinColumn,
    JoinTable,
} from 'typeorm';
import { Listing } from './Listing';
import { Manufacturer } from './Manufacturer';
import { ProductImage } from './ProductImage';
import { UsageType } from './UsageType';
import { Dimension } from './Dimension';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Category } from './Category';
import { ProductType } from './ProductType';
import { ListingAccessory } from './ListingAccessory';

@Entity('product')
export class Product extends VersionControlledEntity {
    @Column({
        length: 100,
    })
    name: string;

    @Column('text', { nullable: true })
    specification: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ default: false })
    is_active: boolean;

    @Column({ default: false })
    is_draft: boolean;

    @OneToOne(() => Dimension, {
        nullable: true,
    })
    @JoinColumn()
    dimensions: Dimension;

    @ManyToOne(() => UsageType, (usageType) => usageType.products, {
        nullable: true,
    })
    usage_type: UsageType;

    @ManyToOne(() => ProductType, (productType) => productType.products, {
        nullable: true,
    })
    product_type: ProductType;

    @OneToMany(() => ProductImage, (productImage) => productImage.product, {
        nullable: true,
        cascade: true,
    })
    product_images: ProductImage[];

    @OneToMany(() => Listing, (listing) => listing.product, {
        nullable: true,
        cascade: true,
    })
    listings: Listing[];

    @ManyToMany(() => Manufacturer, (manufacturer) => manufacturer.products, {
        nullable: true,
    })
    manufacturers: Manufacturer[];

    @ManyToMany(() => Category, (category) => category.products, {
        nullable: true,
    })
    categories: Category[];

    @ManyToMany(() => Product)
    @JoinTable({
        joinColumn: { name: 'product' },
        inverseJoinColumn: { name: 'accessory' },
    })
    connections: Product[];

    parents: Product[];

    @OneToMany(
        () => ListingAccessory,
        (listing_accessory) => listing_accessory.product,
        {
            cascade: true,
        }
    )
    listing_accessories: ListingAccessory[];
}
