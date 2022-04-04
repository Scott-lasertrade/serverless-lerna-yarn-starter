import { Entity, Column, DeleteDateColumn } from 'typeorm';
import { CommonEntity } from './CommonEntity';

@Entity('image_entity')
export class ImageEntity extends CommonEntity {
    @DeleteDateColumn()
    deleted_date: Date;

    @Column()
    bucket: string;

    @Column()
    region: string;

    @Column({ nullable: true })
    key: string;

    @Column()
    order: number;

    @Column({ default: 0 })
    s3VersionId: string;
}
