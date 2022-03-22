import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionTable1641450312848 implements MigrationInterface {
    name = 'TransactionTable1641450312848';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "price" numeric(12,2), "listingId" integer, "buyerId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_fd223432bd1794fd83c49bd9ba9" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_2ef5d5742e52e2bca6d8798dda5" FOREIGN KEY ("buyerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_2ef5d5742e52e2bca6d8798dda5"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_fd223432bd1794fd83c49bd9ba9"`
        );
        await queryRunner.query(`DROP TABLE "transaction"`);
    }
}
