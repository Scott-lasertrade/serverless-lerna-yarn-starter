import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedCategories1635991619634 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            INSERT INTO "category" (id, name) VALUES
            (1, 'Medical'),
            (2, 'Dentistry');
            INSERT INTO "category_type" (id, name, "categoryId") VALUES
            (1, 'Laser', 1),
            (2, 'Tooth Care', 2);
            INSERT INTO "category_function" (id, name, "categoryTypeId") VALUES
            (1, 'Skin Analysis', 1),
            (2, 'Plague Removal', 2),
            (3, 'Alignment', 2);
            INSERT INTO "category_treatment" (id, name) VALUES
            (1, 'Skin Cancer'),
            (2, 'Deep Clean');
            INSERT INTO "category_treatment_to_function" (category_treatment, category_function) VALUES
            (1, 1),
            (2, 2);
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            DELETE FROM "category_treatment_to_function" WHERE category_treatment in 
            (
                1, 
                2
            ) OR category_function in (
                1,
                2,
                3
            );
            DELETE FROM "category_treatment" WHERE name in 
            (
                'Skin Cancer', 
                'Deep Clean',
                'Teeth'
            );
            DELETE FROM "category_function" WHERE name in 
            (
                'Skin Analysis', 
                'Plague Removal',
                'Alignment'
            );
            DELETE FROM "category_type" WHERE name in 
            (
                'Laser', 
                'Surgical',
                'Tooth Care'
            );
            DELETE FROM "category" WHERE name in 
            (
                'Medical', 
                'Dentistry'
            );
            `
        );
    }
}
