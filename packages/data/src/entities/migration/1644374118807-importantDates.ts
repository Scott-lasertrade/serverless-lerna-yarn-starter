import { MigrationInterface, QueryRunner } from 'typeorm';

export class importantDates1644374118807 implements MigrationInterface {
    name = 'importantDates1644374118807';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "important_date" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "iteration" integer NOT NULL, "last_called" TIMESTAMP NOT NULL DEFAULT now(), "created_on" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_51521da2c391da47ad7db1902df" UNIQUE ("name"), CONSTRAINT "PK_295e9252f2c4e9f40cebad7c44e" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`
        );
    }
}
