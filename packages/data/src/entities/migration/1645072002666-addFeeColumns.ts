import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFeeColumns1645072002666 implements MigrationInterface {
    name = 'addFeeColumns1645072002666';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD "fixed_fee" numeric(12,2) NOT NULL DEFAULT '0'`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD "variable_fee" numeric(3,0) NOT NULL DEFAULT '11'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" DROP COLUMN "variable_fee"`
        );
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "fixed_fee"`);
    }
}
