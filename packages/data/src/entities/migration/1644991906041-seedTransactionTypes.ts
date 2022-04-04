import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedTransactionTypes1644991906041 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            INSERT INTO "transaction_type" (id, name) VALUES
            (1, 'Security Deposit'),
            (2, 'Balance Payment')
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            DELETE FROM "transaction_type" WHERE name in 
            (
                'Deposit Deposit', 
                'Balance Payment'
            );
            `
        );
    }
}
