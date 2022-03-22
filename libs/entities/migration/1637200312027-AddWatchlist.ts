import {MigrationInterface, QueryRunner} from "typeorm";

export class AddWatchlist1637200312027 implements MigrationInterface {
    name = 'AddWatchlist1637200312027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "watchlist" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "listingId" integer, "accountId" integer, CONSTRAINT "PK_0c8c0dbcc8d379117138e71ad5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "watchlist" ADD CONSTRAINT "FK_c2c3340657b1e34c6fe057ca4e7" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "watchlist" ADD CONSTRAINT "FK_2d9a75c6b15314c682c8a17d93a" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "watchlist" DROP CONSTRAINT "FK_2d9a75c6b15314c682c8a17d93a"`);
        await queryRunner.query(`ALTER TABLE "watchlist" DROP CONSTRAINT "FK_c2c3340657b1e34c6fe057ca4e7"`);
        await queryRunner.query(`DROP TABLE "watchlist"`);
    }

}
