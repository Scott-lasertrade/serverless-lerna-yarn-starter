import { MigrationInterface, QueryRunner } from 'typeorm';

export class businessFields1639539789683 implements MigrationInterface {
    name = 'businessFields1639539789683';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "account" ADD "account_type" character varying(32)`
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD "business_phone_number" character varying(16)`
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD "legal_name" character varying(128)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "account" DROP COLUMN "legal_name"`
        );
        await queryRunner.query(
            `ALTER TABLE "account" DROP COLUMN "business_phone_number"`
        );
        await queryRunner.query(
            `ALTER TABLE "account" DROP COLUMN "account_type"`
        );
    }
}
