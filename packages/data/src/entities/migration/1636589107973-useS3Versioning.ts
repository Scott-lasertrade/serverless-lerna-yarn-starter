import { MigrationInterface, QueryRunner } from 'typeorm';

export class useS3Versioning1636589107973 implements MigrationInterface {
    name = 'useS3Versioning1636589107973';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "listing_image" RENAME COLUMN "version" TO "s3VersionId"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_image" RENAME COLUMN "version" TO "s3VersionId"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_image" DROP COLUMN "s3VersionId"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_image" ADD "s3VersionId" character varying NOT NULL DEFAULT '0'`
        );
        await queryRunner.query(
            `ALTER TABLE "product_image" DROP COLUMN "s3VersionId"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_image" ADD "s3VersionId" character varying NOT NULL DEFAULT '0'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_image" DROP COLUMN "s3VersionId"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_image" ADD "s3VersionId" integer NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_image" DROP COLUMN "s3VersionId"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_image" ADD "s3VersionId" integer NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "product_image" RENAME COLUMN "s3VersionId" TO "version"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_image" RENAME COLUMN "s3VersionId" TO "version"`
        );
    }
}
