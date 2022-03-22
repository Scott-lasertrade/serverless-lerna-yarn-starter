import { MigrationInterface, QueryRunner } from 'typeorm';

export class OfferHistoryMoreText1639960587338 implements MigrationInterface {
    name = 'OfferHistoryMoreText1639960587338';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "offer_history" ADD "seller_text" character varying NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "offer_history" DROP COLUMN "seller_text"`
        );
    }
}
