import { Product, Usage } from '@entities';
import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';

@Entity('usage_type')
export class UsageType extends CommonEntity {
    @Column()
    name: string;

    @OneToMany(() => Product, (product) => product.usage_type)
    products: Product[];

    @OneToMany(() => Usage, (usage) => usage.usage_type)
    usages: Usage[];
}
