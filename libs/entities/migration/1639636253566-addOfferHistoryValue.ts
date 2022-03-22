import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOfferHistoryValue1639636253566 implements MigrationInterface {
    name = 'addOfferHistoryValue1639636253566';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "offer_history" ADD "value" integer NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "offer_history" DROP COLUMN "value"`
        );
    }
}
