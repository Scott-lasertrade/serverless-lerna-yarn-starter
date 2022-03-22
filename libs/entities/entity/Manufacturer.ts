import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './Product';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';

@Entity('manufacturer')
export class Manufacturer extends VersionControlledEntity {
    @Column()
    name: string;

    @Column({ default: true })
    is_approved: boolean;

    @ManyToMany(() => Product, (product) => product.manufacturers)
    @JoinTable({
        name: 'product_to_manufacturer',
        joinColumn: {
            name: 'manufacturer',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'product',
            referencedColumnName: 'id',
        },
    })
    products: Product[];
}
