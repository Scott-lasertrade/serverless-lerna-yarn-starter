import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeUsageMetric1639955790159 implements MigrationInterface {
    name = 'removeUsageMetric1639955790159';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usage" DROP COLUMN "metric"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "usage" ADD "metric" character varying NOT NULL`
        );
    }
}
