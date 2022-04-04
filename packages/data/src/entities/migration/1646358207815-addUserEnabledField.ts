import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserEnabledField1646358207815 implements MigrationInterface {
    name = 'addUserEnabledField1646358207815';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" ADD "enabled" boolean NOT NULL DEFAULT true`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "enabled"`);
    }
}
