import {
    Entity,
    Column,
    Unique,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
} from 'typeorm';

@Entity('important_date')
@Unique(['name'])
export class ImportantDate extends BaseEntity {
    constructor(id?: number) {
        super();
        if (id) {
            this.id = id;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: 0 })
    iteration: number;

    @Column({ nullable: true })
    run_started: Date;

    @Column({ nullable: true })
    run_ended: Date;

    @CreateDateColumn()
    created_on: Date;
}
