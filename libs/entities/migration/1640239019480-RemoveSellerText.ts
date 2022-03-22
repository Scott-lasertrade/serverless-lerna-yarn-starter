import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveSellerText1640239019480 implements MigrationInterface {
    name = 'RemoveSellerText1640239019480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer_history" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "offer_history" DROP COLUMN "seller_text"`);
        await queryRunner.query(`ALTER TABLE "offer_history" ADD "info" character varying`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23T05:00:30.006Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`);
        await queryRunner.query(`ALTER TABLE "offer_history" DROP COLUMN "info"`);
        await queryRunner.query(`ALTER TABLE "offer_history" ADD "seller_text" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer_history" ADD "text" character varying NOT NULL`);
    }

}
