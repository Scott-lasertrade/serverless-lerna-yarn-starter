import { Entity, Column } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';

@Entity('dimension')
export class Dimension extends CommonEntity {
    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    weight: number;

    @Column({ nullable: true })
    length: number;

    @Column({ nullable: true })
    height: number;

    @Column({ nullable: true })
    width: number;
}
