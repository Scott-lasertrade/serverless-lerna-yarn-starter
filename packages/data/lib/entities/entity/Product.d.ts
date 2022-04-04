import { Listing } from './Listing';
import { Manufacturer } from './Manufacturer';
import { ProductImage } from './ProductImage';
import { UsageType } from './UsageType';
import { Dimension } from './Dimension';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { Category } from './Category';
import { ProductType } from './ProductType';
import { ListingAccessory } from './ListingAccessory';
export declare class Product extends VersionControlledEntity {
    name: string;
    specification: string;
    description: string;
    is_active: boolean;
    is_draft: boolean;
    dimensions: Dimension;
    usage_type: UsageType;
    product_type: ProductType;
    product_images: ProductImage[];
    listings: Listing[];
    manufacturers: Manufacturer[];
    categories: Category[];
    connections: Product[];
    parents: Product[];
    listing_accessories: ListingAccessory[];
}
//# sourceMappingURL=Product.d.ts.map