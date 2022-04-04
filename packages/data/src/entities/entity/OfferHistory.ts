import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Offer } from './Offer';
import { OfferStatus } from './OfferStatus';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';

@Entity('offer_history')
export class OfferHistory extends VersionControlledEntity {
    @Column()
    date: Date;

    @ManyToOne(() => Offer, (offer) => offer.offer_history, {
        nullable: true,
    })
    offer: Offer;

    @Column()
    value: Number;

    @ManyToOne(() => OfferStatus, {
        cascade: true,
    })
    @JoinColumn()
    status: OfferStatus;

    @Column({ nullable: true })
    info: string;
}
