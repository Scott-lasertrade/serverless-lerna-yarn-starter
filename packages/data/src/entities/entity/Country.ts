import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Address } from './Address';

@Entity('country')
export class Country extends CommonEntity {
    @Column({ length: 64 })
    name: string;

    @Column({ length: 3 })
    abbreviation: string;

    @OneToMany(() => Address, (address) => address.country)
    addresses: Address[];
}
