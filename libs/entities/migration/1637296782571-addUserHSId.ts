import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserHSId1637296782571 implements MigrationInterface {
    name = 'addUserHSId1637296782571';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" ADD "hubspot_user_id" character varying NOT NULL DEFAULT 'Manually replace'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" DROP COLUMN "hubspot_user_id"`
        );
    }
}
