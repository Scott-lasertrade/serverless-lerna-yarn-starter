import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterImportantDates1645400075050 implements MigrationInterface {
    name = 'alterImportantDates1645400075050';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "important_date" DROP COLUMN "last_called"`
        );
        await queryRunner.query(
            `ALTER TABLE "important_date" ADD "run_started" TIMESTAMP`
        );
        await queryRunner.query(
            `ALTER TABLE "important_date" ADD "run_ended" TIMESTAMP`
        );
        await queryRunner.query(
            `ALTER TABLE "important_date" ALTER COLUMN "iteration" SET DEFAULT '0'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "important_date" ALTER COLUMN "iteration" DROP DEFAULT`
        );
        await queryRunner.query(
            `ALTER TABLE "important_date" DROP COLUMN "run_ended"`
        );
        await queryRunner.query(
            `ALTER TABLE "important_date" DROP COLUMN "run_started"`
        );
        await queryRunner.query(
            `ALTER TABLE "important_date" ADD "last_called" TIMESTAMP NOT NULL DEFAULT now()`
        );
    }
}
