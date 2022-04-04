import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertOfferStatusCancel1640159091034
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            INSERT INTO "offer_status" (id,name)  VALUES 
            ('7','Offer cancelled')
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            DELETE FROM "offer_status" WHERE name = 'Offer cancelled';
            `
        );
    }
}
