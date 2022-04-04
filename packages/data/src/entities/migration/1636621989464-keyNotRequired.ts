import { MigrationInterface, QueryRunner } from 'typeorm';

export class keyNotRequired1636621989464 implements MigrationInterface {
    name = 'keyNotRequired1636621989464';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "listing_image" ALTER COLUMN "key" DROP NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "product_image" ALTER COLUMN "key" DROP NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_image" ALTER COLUMN "key" SET NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_image" ALTER COLUMN "key" SET NOT NULL`
        );
    }
}
