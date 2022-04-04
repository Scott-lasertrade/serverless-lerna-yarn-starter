import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedNewListingStatuses1640143295612 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            UPDATE "listing_status" SET name='Listed' WHERE name='Approved';
            `
        );
        await queryRunner.query(
            `
            UPDATE "listing_status" SET name='Pending Review' WHERE name='Submitted';
            `
        );
        await queryRunner.query(
            `
            INSERT INTO "listing_status" (id, name) VALUES 
            (7, 'Sold'), 
            (8, 'Pending Sale');
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "listing_status" WHERE name in ('Sold', 'Pending Sale');`
        );
        await queryRunner.query(
            `UPDATE "listing_status" SET name='Submitted' WHERE name='Pending Review';`
        );
        await queryRunner.query(
            `UPDATE "listing_status" SET name='Approved' WHERE name='Listed';`
        );
    }
}
