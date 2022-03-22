import { MigrationInterface, QueryRunner } from 'typeorm';

export class productType1642557844582 implements MigrationInterface {
    name = 'productType1642557844582';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "product_type" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, CONSTRAINT "PK_e0843930fbb8854fe36ca39dae1" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `
            INSERT INTO "product_type" (id, name) VALUES 
            (1, 'Device'), 
            (2, 'Accessory');
            `
        );
        await queryRunner.query(
            `ALTER TABLE "product" ADD "productTypeId" integer`
        );
        await queryRunner.query(`update "product" SET "productTypeId" = 1`);
        await queryRunner.query(
            `ALTER TABLE "product" ADD CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98" FOREIGN KEY ("productTypeId") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product" DROP CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98"`
        );
        await queryRunner.query(
            `ALTER TABLE "product" DROP COLUMN "productTypeId"`
        );
        await queryRunner.query(`DROP TABLE "product_type"`);
    }
}
