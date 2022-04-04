import { MigrationInterface, QueryRunner } from 'typeorm';

export class allowNullsForDraft1642575068899 implements MigrationInterface {
    name = 'allowNullsForDraft1642575068899';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "dimension" ALTER COLUMN "weight" DROP NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "dimension" ALTER COLUMN "length" DROP NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "dimension" ALTER COLUMN "height" DROP NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "dimension" ALTER COLUMN "width" DROP NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "dimension" ALTER COLUMN "width" SET NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "dimension" ALTER COLUMN "height" SET NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "dimension" ALTER COLUMN "length" SET NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "dimension" ALTER COLUMN "weight" SET NOT NULL`
        );
    }
}
