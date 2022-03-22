import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedAddressType1638402100648 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            INSERT INTO "address_type" (id, name) VALUES 
            (1, 'Business'),
            (2, 'Listing');
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            DELETE FROM "address_type" WHERE name in 
            (
                'Business',
                'Listing'
            );
            `
        );
    }
}
