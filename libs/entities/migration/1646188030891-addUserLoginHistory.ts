import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserLoginHistory1646188030891 implements MigrationInterface {
    name = 'addUserLoginHistory1646188030891';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_login_history" ("id" SERIAL NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer, CONSTRAINT "PK_cc6cb18451f716b40ed6cd898b1" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "user_login_history" ADD CONSTRAINT "FK_8cd045e34dacf6e82ac34e783b5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_login_history" DROP CONSTRAINT "FK_8cd045e34dacf6e82ac34e783b5"`
        );
        await queryRunner.query(`DROP TABLE "user_login_history"`);
    }
}
