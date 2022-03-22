import { MigrationInterface, QueryRunner } from 'typeorm';

export class listingStatusTable1638498841219 implements MigrationInterface {
    name = 'listingStatusTable1638498841219';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "listing" RENAME COLUMN "status" TO "listingStatusId"`
        );
        await queryRunner.query(
            `ALTER TYPE "public"."listing_status_enum" RENAME TO "listing_listingstatusid_enum"`
        );
        await queryRunner.query(
            `CREATE TABLE "listing_status" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(16) NOT NULL, CONSTRAINT "PK_0524b292b49efd99751063f6ebc" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" DROP COLUMN "listingStatusId"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" ADD "listingStatusId" integer`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" ADD CONSTRAINT "FK_194d206b73555b22b80462b30c2" FOREIGN KEY ("listingStatusId") REFERENCES "listing_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `
            INSERT INTO "listing_status" (id, name) VALUES 
            (1, 'Draft'),
            (2, 'Submitted'),
            (3, 'Approved'),
            (4, 'Rejected'),
            (5, 'Suspended')
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "listing" DROP CONSTRAINT "FK_194d206b73555b22b80462b30c2"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" DROP COLUMN "listingStatusId"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" ADD "listingStatusId" "public"."listing_listingstatusid_enum" DEFAULT 'Product'`
        );
        await queryRunner.query(`DROP TABLE "listing_status"`);
        await queryRunner.query(
            `ALTER TYPE "public"."listing_listingstatusid_enum" RENAME TO "listing_status_enum"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" RENAME COLUMN "listingStatusId" TO "status"`
        );
        await queryRunner.query(`
            DELETE FROM "listing_status" WHERE name in 
            (
                'Draft',
                'Submitted',
                'Approved',
                'Rejected',
                'Suspended'
            );
        `);
    }
}
