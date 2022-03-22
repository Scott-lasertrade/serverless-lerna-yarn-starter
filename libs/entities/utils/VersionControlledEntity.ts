import { Entity, VersionColumn, DeleteDateColumn } from 'typeorm';

import { CommonEntity } from './CommonEntity';

@Entity()
export class VersionControlledEntity extends CommonEntity {
    constructor(id?: number, version?: number) {
        super(id);
        this.id = id;
        this.version = version;
    }

    @VersionColumn({ default: 1 })
    version: number;

    @DeleteDateColumn()
    deleted_date: Date;
}
