import {MigrationInterface, QueryRunner} from "typeorm";

export class renameOffersTowardsLimit1636506339916 implements MigrationInterface {
    name = 'renameOffersTowardsLimit1636506339916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" RENAME COLUMN "offersTowardsLimit" TO "offers_towards_limit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" RENAME COLUMN "offers_towards_limit" TO "offersTowardsLimit"`);
    }

}
