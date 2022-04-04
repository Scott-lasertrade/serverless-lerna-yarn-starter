import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOfferHistory1639633025920 implements MigrationInterface {
    name = 'addOfferHistory1639633025920';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "offer_history" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "text" character varying NOT NULL, "type" integer, "date" TIMESTAMP NOT NULL, "offerId" integer, CONSTRAINT "PK_f37fc79f8b462f53fe1f64a9044" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "offer_history" ADD CONSTRAINT "FK_ba85ecc7789218b80c3c3925473" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "offer_history" DROP CONSTRAINT "FK_ba85ecc7789218b80c3c3925473"`
        );
        await queryRunner.query(`DROP TABLE "offer_history"`);
    }
}
