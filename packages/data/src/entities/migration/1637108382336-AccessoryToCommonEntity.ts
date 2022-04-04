import {MigrationInterface, QueryRunner} from "typeorm";

export class AccessoryToCommonEntity1637108382336 implements MigrationInterface {
    name = 'AccessoryToCommonEntity1637108382336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accessory" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "accessory" DROP COLUMN "deleted_date"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accessory" ADD "deleted_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "accessory" ADD "version" integer NOT NULL`);
    }

}
