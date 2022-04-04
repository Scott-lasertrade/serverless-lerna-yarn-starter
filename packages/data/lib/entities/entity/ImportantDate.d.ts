import { BaseEntity } from 'typeorm';
export declare class ImportantDate extends BaseEntity {
    constructor(id?: number);
    id: number;
    name: string;
    iteration: number;
    run_started: Date;
    run_ended: Date;
    created_on: Date;
}
//# sourceMappingURL=ImportantDate.d.ts.map