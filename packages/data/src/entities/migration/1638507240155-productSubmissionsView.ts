import { MigrationInterface, QueryRunner } from 'typeorm';

export class productSubmissionsView1638507240155 implements MigrationInterface {
    name = 'productSubmissionsView1638507240155';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE VIEW "product_submissions_view" AS 
        select 	p.id, 
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
                pi2.key as thumbnail_key,
                p.create_at
        from public.product p
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
        where p.deleted_date is null and pi2.deleted_date is null
        and p.is_active = '1' and p.is_draft = '1'
        group by p.id, pi2.id
    `);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'VIEW',
                'public',
                'product_submissions_view',
                "select \tp.id, \n                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, \n                pi2.key as thumbnail_key,\n                p.create_at\n        from public.product p\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join product_image pi2 on pi2.\"productId\" = p.id and pi2.order = 0\n        where p.deleted_date is null and pi2.deleted_date is null\n        and p.is_active = '1' and p.is_draft = '1'\n        group by p.id, pi2.id",
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['VIEW', 'public', 'product_submissions_view']
        );
        await queryRunner.query(`DROP VIEW "product_submissions_view"`);
    }
}
