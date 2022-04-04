import { MigrationInterface, QueryRunner } from 'typeorm';

export class addStripeUserAccount1643334475541 implements MigrationInterface {
    name = 'addStripeUserAccount1643334475541';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "account" ADD "stripe_user_id" character varying(128)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "account" DROP COLUMN "stripe_user_id"`
        );
    }
}
