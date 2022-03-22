import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedCurrencyTypes1635986407025 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            INSERT INTO "currency_type" (id, name, abbreviation, symbol) VALUES (1, 'Australian Dollar', 'AUD', '$')
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            DELETE FROM "currency_type" WHERE name = 'Australian Dollar'
            `
        );
    }
}
