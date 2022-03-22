import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedUnpublishedListingStatus1639979589036
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            INSERT INTO "listing_status" (id, name) VALUES 
            (6, 'Unpublished');
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "listing_status" WHERE name in 
            (
                'Unpublished'
            );
        `);
    }
}
