import { MigrationInterface, QueryRunner } from 'typeorm';

export class productToProduct1642482152901 implements MigrationInterface {
    name = 'productToProduct1642482152901';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "product_connections_product" ("product" integer NOT NULL, "accessory" integer NOT NULL, CONSTRAINT "PK_1807d8be182b462e44cbe3e0825" PRIMARY KEY ("product", "accessory"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_aa466a8381fe6f8bc6563b184b" ON "product_connections_product" ("product") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_5c459dce3ff0c1ad94decd7b24" ON "product_connections_product" ("accessory") `
        );
        await queryRunner.query(
            `ALTER TABLE "product_connections_product" ADD CONSTRAINT "FK_aa466a8381fe6f8bc6563b184b6" FOREIGN KEY ("product") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "product_connections_product" ADD CONSTRAINT "FK_5c459dce3ff0c1ad94decd7b243" FOREIGN KEY ("accessory") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_connections_product" DROP CONSTRAINT "FK_5c459dce3ff0c1ad94decd7b243"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_connections_product" DROP CONSTRAINT "FK_aa466a8381fe6f8bc6563b184b6"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_5c459dce3ff0c1ad94decd7b24"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_aa466a8381fe6f8bc6563b184b"`
        );
        await queryRunner.query(`DROP TABLE "product_connections_product"`);
    }
}
