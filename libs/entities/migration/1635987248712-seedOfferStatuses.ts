import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedOfferStatuses1635987248712 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            INSERT INTO "offer_status" (id, name) VALUES
            (1, 'Offer made'),
            (2, 'Seller countered offer'),
            (3, 'Buyer countered offer'),
            (4, 'Offer accepted'),
            (5, 'Offer declined'),
            (6, 'Offer expired');
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            DELETE FROM "offer_status" WHERE name in 
            (
                'Offer made', 
                'Seller countered offer', 
                'Buyer countered offer', 
                'Offer accepted', 
                'Offer declined',
                'Offer expired'
            );
            `
        );
    }
}
