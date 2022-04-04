import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedUsageTypes1635985542696 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            INSERT INTO "usage_type" (id, name) VALUES 
            (1, 'Hours'),
            (2, 'Shots');
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            DELETE FROM "usage_type" WHERE name in 
            (
                'Hours',
                'Shots'
            );
            `
        );
    }
}
