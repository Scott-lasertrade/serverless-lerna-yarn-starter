import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Product } from './Product';

@Entity('product_type')
export class ProductType extends CommonEntity {
    @Column({
        length: 100,
    })
    name: string;

    @OneToMany(() => Product, (product) => product.product_type)
    products: Product[];
}
