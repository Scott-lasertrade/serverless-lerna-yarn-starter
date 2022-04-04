import { MigrationInterface, QueryRunner } from 'typeorm';

export class businessNumberToTaxId1638419018165 implements MigrationInterface {
    name = 'businessNumberToTaxId1638419018165';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "account" RENAME COLUMN "registration_number" TO "tax_id"`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "account" RENAME COLUMN "tax_id" TO "registration_number"`
        );
    }
}
