import { MigrationInterface, QueryRunner } from 'typeorm';

export class setupTransaction1643853429452 implements MigrationInterface {
    name = 'setupTransaction1643853429452';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "price"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "stripe_pi_id" text NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "stripe_payment_status" text NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "offerId" integer`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_f4ac0e88f7210ad311200876fe6" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_f4ac0e88f7210ad311200876fe6"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "offerId"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "stripe_payment_status"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "stripe_pi_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "price" numeric(12,2)`
        );
    }
}
