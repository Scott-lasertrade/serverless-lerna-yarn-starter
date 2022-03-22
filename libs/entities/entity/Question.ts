import { Entity, Column, ManyToOne } from 'typeorm';
import { Listing } from './Listing';
import { Account } from './Account';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';

@Entity('question')
export class Question extends VersionControlledEntity {
    @ManyToOne(() => Listing, (listing) => listing.questions, {
        nullable: true,
    })
    listing: Listing;

    @ManyToOne(() => Account, (account) => account.questions, {
        nullable: true,
    })
    asker: Account;

    @Column({ nullable: true })
    question: string;
    @Column({ nullable: true })
    answer: string;
}
