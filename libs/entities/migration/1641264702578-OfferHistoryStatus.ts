import {MigrationInterface, QueryRunner} from "typeorm";

export class OfferHistoryStatus1641264702578 implements MigrationInterface {
    name = 'OfferHistoryStatus1641264702578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer_history" RENAME COLUMN "type" TO "statusId"`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23T05:00:30.006Z'`);
        await queryRunner.query(`ALTER TABLE "offer_history" ADD CONSTRAINT "FK_b83314f8bdf43821026ba930bbf" FOREIGN KEY ("statusId") REFERENCES "offer_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer_history" DROP CONSTRAINT "FK_b83314f8bdf43821026ba930bbf"`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`);
        await queryRunner.query(`ALTER TABLE "offer_history" RENAME COLUMN "statusId" TO "type"`);
    }

}
