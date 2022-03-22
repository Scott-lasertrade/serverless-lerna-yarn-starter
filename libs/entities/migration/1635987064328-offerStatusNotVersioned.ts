import { MigrationInterface, QueryRunner } from 'typeorm';

export class offerStatusNotVersioned1635987064328
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "offer_status" DROP COLUMN "version"`
        );
        await queryRunner.query(
            `ALTER TABLE "offer_status" DROP COLUMN "deleted_date"`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "offer_status" ADD "deleted_date" TIMESTAMP`
        );
        await queryRunner.query(
            `ALTER TABLE "offer_status" ADD "version" integer NOT NULL`
        );
    }
}
