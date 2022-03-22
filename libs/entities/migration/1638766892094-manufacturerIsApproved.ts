import { MigrationInterface, QueryRunner } from 'typeorm';

export class manufacturerIsApproved1638766892094 implements MigrationInterface {
    name = 'manufacturerIsApproved1638766892094';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "manufacturer" ADD "is_approved" boolean NOT NULL DEFAULT true`
        );
        await queryRunner.query(`CREATE VIEW "listings_approval_view" AS 
        select 	l.id, 
                p.id as product_id,
                p.is_active as product_is_active,
                p.is_draft as product_is_draft,
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name || ' ' || l."YOM" as title, 
                li.key as thumbnail_key,
                a.business_name as submitted_by, 
                p.create_at
        from public.listing l
        inner join product p on l."productId" = p.id 
        inner join listing_status ls on ls.id = l."listingStatusId"
        inner join account a on l."accountId" = a.id 
        left join listing_image li on li."listingId" = l.id and li.order = 0
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer
        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null
        and ls.name = 'Submitted'
        group by l.id, p.id, li.id, a.id
    `);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'VIEW',
                'public',
                'listings_approval_view',
                'select \tl.id, \n                p.id as product_id,\n                p.is_active as product_is_active,\n                p.is_draft as product_is_draft,\n                coalesce((string_agg(m.name, \' \')), \'\') || \' \' || p.name || \' \' || l."YOM" as title, \n                li.key as thumbnail_key,\n                a.business_name as submitted_by, \n                p.create_at\n        from public.listing l\n        inner join product p on l."productId" = p.id \n        inner join listing_status ls on ls.id = l."listingStatusId"\n        inner join account a on l."accountId" = a.id \n        left join listing_image li on li."listingId" = l.id and li.order = 0\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer\n        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null\n        and ls.name = \'Submitted\'\n        group by l.id, p.id, li.id, a.id',
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['VIEW', 'public', 'listings_approval_view']
        );
        await queryRunner.query(`DROP VIEW "listings_approval_view"`);
        await queryRunner.query(
            `ALTER TABLE "manufacturer" DROP COLUMN "is_approved"`
        );
    }
}
