import { MigrationInterface, QueryRunner } from 'typeorm';

export class removalOfAccessory1642651701492 implements MigrationInterface {
    name = 'removalOfAccessory1642651701492';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "accessory" DROP CONSTRAINT "FK_ee91d3127a921077a68cc4dcc38"`
        );
        await queryRunner.query(
            `ALTER TABLE "accessory" DROP CONSTRAINT "FK_524f3c65638480ed74db8112a7c"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_accessory" DROP CONSTRAINT "FK_0e5241ed8b4c972ffd14008fbc0"`
        );
        await queryRunner.query(`DROP TABLE "accessory"`);
        await queryRunner.query(
            `ALTER TABLE "listing_accessory" RENAME COLUMN "accessoryId" TO "productId"`
        );
        await queryRunner.query(
            `ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23T05:00:30.006Z'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_accessory" ADD CONSTRAINT "FK_1a025aaf5338de8683fcd270430" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "listing_accessory" DROP CONSTRAINT "FK_1a025aaf5338de8683fcd270430"`
        );
        await queryRunner.query(
            `ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_accessory" RENAME COLUMN "productId" TO "accessoryId"`
        );
        await queryRunner.query(
            `CREATE TABLE "accessory" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "name" character varying(100) NOT NULL, "usageTypeId" integer, "productId" integer, CONSTRAINT "PK_e1ead99f958789eeebd86246d74" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_accessory" ADD CONSTRAINT "FK_0e5241ed8b4c972ffd14008fbc0" FOREIGN KEY ("accessoryId") REFERENCES "accessory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "accessory" ADD CONSTRAINT "FK_524f3c65638480ed74db8112a7c" FOREIGN KEY ("usageTypeId") REFERENCES "usage_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "accessory" ADD CONSTRAINT "FK_ee91d3127a921077a68cc4dcc38" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }
}
