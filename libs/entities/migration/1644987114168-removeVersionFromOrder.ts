import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeVersionFromOrder1644987114168 implements MigrationInterface {
    name = 'removeVersionFromOrder1644987114168';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "version"`);
        await queryRunner.query(
            `ALTER TABLE "order" DROP COLUMN "deleted_date"`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD "deleted_date" TIMESTAMP`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD "version" integer NOT NULL`
        );
    }
}
