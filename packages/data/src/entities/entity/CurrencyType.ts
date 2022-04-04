import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Listing } from './Listing';

@Entity('currency_type')
export class CurrencyType extends CommonEntity {
    @Column({ length: 32 })
    name: string;

    @Column({ length: 3 })
    abbreviation: string;

    @Column({ length: 1 })
    symbol: string;

    @OneToMany(() => Listing, (listing) => listing.currency_type)
    listings: Listing[];
}
