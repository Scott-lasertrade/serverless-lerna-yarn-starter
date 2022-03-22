import { MigrationInterface, QueryRunner } from 'typeorm';

export class Question1644974057931 implements MigrationInterface {
    name = 'Question1644974057931';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "question" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "question" character varying, "answer" character varying, "listingId" integer, "askerId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "question" ADD CONSTRAINT "FK_7ff100790c3fd984889e7f687a8" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "question" ADD CONSTRAINT "FK_8bd7497b93b24446bda7e61d1e4" FOREIGN KEY ("askerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "question" DROP CONSTRAINT "FK_8bd7497b93b24446bda7e61d1e4"`
        );
        await queryRunner.query(
            `ALTER TABLE "question" DROP CONSTRAINT "FK_7ff100790c3fd984889e7f687a8"`
        );
        await queryRunner.query(`DROP TABLE "question"`);
    }
}
