import { MigrationInterface, QueryRunner } from 'typeorm';

export class addListingVersionToCart1644984552731
    implements MigrationInterface
{
    name = 'addListingVersionToCart1644984552731';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "cart_item" ADD "listing_version" integer NOT NULL DEFAULT '1'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "cart_item" DROP COLUMN "listing_version"`
        );
    }
}
