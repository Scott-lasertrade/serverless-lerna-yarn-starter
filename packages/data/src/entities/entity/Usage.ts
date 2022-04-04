import { Entity, Column, ManyToOne } from 'typeorm';
import { UsageType } from './UsageType';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';

@Entity('usage')
export class Usage extends VersionControlledEntity {
    @Column({ nullable: true })
    value: number;

    @ManyToOne(() => UsageType, (usageType) => usageType.usages, {
        nullable: true,
    })
    usage_type: UsageType;
}
