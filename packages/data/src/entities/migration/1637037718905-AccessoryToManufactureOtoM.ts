import {MigrationInterface, QueryRunner} from "typeorm";

export class AccessoryToManufactureOtoM1637037718905 implements MigrationInterface {
    name = 'AccessoryToManufactureOtoM1637037718905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accessory" ADD "manufacturerId" integer`);
        await queryRunner.query(`ALTER TABLE "accessory" ADD CONSTRAINT "FK_6e2eb05a37ada37c29c662dad3e" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accessory" DROP CONSTRAINT "FK_6e2eb05a37ada37c29c662dad3e"`);
        await queryRunner.query(`ALTER TABLE "accessory" DROP COLUMN "manufacturerId"`);
    }

}
