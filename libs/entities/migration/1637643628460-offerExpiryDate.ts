import { MigrationInterface, QueryRunner } from 'typeorm';

export class offerExpiryDate1637643628460 implements MigrationInterface {
    name = 'offerExpiryDate1637643628460';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "offer" ADD "offer_expiry_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '"2021-11-23T05:00:30.006Z"'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "offer" DROP COLUMN "offer_expiry_date"`
        );
    }
}
