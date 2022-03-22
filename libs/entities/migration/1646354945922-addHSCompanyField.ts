import { MigrationInterface, QueryRunner } from 'typeorm';

export class addHSCompanyField1646354945922 implements MigrationInterface {
    name = 'addHSCompanyField1646354945922';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "account" ADD "hubspot_company_id" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "account" DROP COLUMN "hubspot_company_id"`
        );
    }
}
