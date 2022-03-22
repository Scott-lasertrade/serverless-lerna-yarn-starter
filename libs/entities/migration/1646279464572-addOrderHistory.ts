import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOrderHistory1646279464572 implements MigrationInterface {
    name = 'addOrderHistory1646279464572';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "order_history" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_number" character varying, "total" numeric(12,2), "paid" numeric(12,2), "deposit" numeric(12,2), "fixed_fee" numeric(12,2) NOT NULL DEFAULT '0', "variable_fee" numeric(3,0) NOT NULL DEFAULT '11', "orderId" integer, "listingId" integer, "statusId" integer, "buyerId" integer, "checkoutId" integer, CONSTRAINT "PK_cc71513680d03ecb01b96655b0c" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" ADD CONSTRAINT "FK_e15b4a73a3e53311433968993cc" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" ADD CONSTRAINT "FK_fb96ad01938c82e1906d26557e9" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" ADD CONSTRAINT "FK_af6f6c0eb6b049a4c22caf0a063" FOREIGN KEY ("statusId") REFERENCES "order_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" ADD CONSTRAINT "FK_5c00687b777198777aa70cf96a7" FOREIGN KEY ("buyerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" ADD CONSTRAINT "FK_a5652a83f508cf220f5053f0e51" FOREIGN KEY ("checkoutId") REFERENCES "checkout"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order_history" DROP CONSTRAINT "FK_a5652a83f508cf220f5053f0e51"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" DROP CONSTRAINT "FK_5c00687b777198777aa70cf96a7"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" DROP CONSTRAINT "FK_af6f6c0eb6b049a4c22caf0a063"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" DROP CONSTRAINT "FK_fb96ad01938c82e1906d26557e9"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" DROP CONSTRAINT "FK_e15b4a73a3e53311433968993cc"`
        );
        await queryRunner.query(`DROP TABLE "order_history"`);
    }
}
