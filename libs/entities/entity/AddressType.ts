import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Address } from './Address';

@Entity('address_type')
export class AddressType extends CommonEntity {
    @Column({ length: 16 })
    name: string;

    @OneToMany(() => Address, (address) => address.address_type)
    addresses: Address[];
}
