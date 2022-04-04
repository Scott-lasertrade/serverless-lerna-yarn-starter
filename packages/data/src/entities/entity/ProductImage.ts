import { Entity, ManyToOne } from 'typeorm';
import { Product } from './Product';
import { ImageEntity } from '../utils/ImageEntity';

@Entity('product_image')
export class ProductImage extends ImageEntity {
    @ManyToOne(() => Product, (product) => product.product_images, {
        onDelete: 'CASCADE',
    })
    product: Product;
}
