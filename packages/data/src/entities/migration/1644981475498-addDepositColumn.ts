import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDepositColumn1644981475498 implements MigrationInterface {
    name = 'addDepositColumn1644981475498';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD "deposit" numeric(12,2)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deposit"`);
    }
}
