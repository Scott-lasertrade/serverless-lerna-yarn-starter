import { Entity, Column } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';

@Entity('offer_status')
export class OfferStatus extends CommonEntity {
    @Column({
        length: 100,
    })
    name: string;
}
