import { MigrationInterface, QueryRunner } from 'typeorm';

export class addressToListing1638403967451 implements MigrationInterface {
    name = 'addressToListing1638403967451';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "address" DROP CONSTRAINT "FK_b46b132f3f3f727522cf8eb40cc"`
        );
        await queryRunner.query(
            `ALTER TABLE "address" DROP CONSTRAINT "REL_b46b132f3f3f727522cf8eb40c"`
        );
        await queryRunner.query(
            `ALTER TABLE "address" DROP COLUMN "accountId"`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "address" ADD "accountId" integer`
        );
        await queryRunner.query(
            `ALTER TABLE "address" ADD CONSTRAINT "REL_b46b132f3f3f727522cf8eb40c" UNIQUE ("accountId")`
        );
        await queryRunner.query(
            `ALTER TABLE "address" ADD CONSTRAINT "FK_b46b132f3f3f727522cf8eb40cc" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
