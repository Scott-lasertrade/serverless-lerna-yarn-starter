import {
    Entity,
    Column,
    Unique,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Product } from './Product';

@Entity('category')
@Unique(['key'])
export class Category extends CommonEntity {
    @Column()
    key: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    parent_id: number;

    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({ name: 'parent_id' })
    parent?: Category;

    @ManyToMany(() => Product, (product) => product.categories)
    @JoinTable({
        name: 'category_to_product',
        joinColumn: {
            name: 'category',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'product',
            referencedColumnName: 'id',
        },
    })
    products: Product[];
}
