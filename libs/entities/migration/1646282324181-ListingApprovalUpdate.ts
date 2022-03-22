import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListingApprovalUpdate1646282324181 implements MigrationInterface {
    name = 'ListingApprovalUpdate1646282324181';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['VIEW', 'public', 'listings_approval_view']
        );
        await queryRunner.query(`DROP VIEW "listings_approval_view"`);
        await queryRunner.query(`CREATE VIEW "listings_approval_view" AS 
        select 	l.id, 
                l.version as version,
                l.cost as cost,
                a.id as account_id,
                p.id as product_id,
                p.name as product_name,
                p.is_active as product_is_active,
                p.is_draft as product_is_draft,
                p.version as product_version,
                coalesce(cast(l."YOM" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, 
                li.key as thumbnail_key,
                li.bucket as thumbnail_bucket,
                li.region as thumbnail_region,
                ls.name as listing_status,
                a.business_name as submitted_by, 
                l.create_at
        from public.listing l
        inner join product p on l."productId" = p.id 
        inner join listing_status ls on ls.id = l."listingStatusId"
        inner join account a on l."accountId" = a.id 
        left join listing_image li on li."listingId" = l.id and li.order = 0
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer
        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null
        group by l.id, p.id, li.id, a.id, ls.id
    `);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'VIEW',
                'public',
                'listings_approval_view',
                'select \tl.id, \n                l.version as version,\n                l.cost as cost,\n                a.id as account_id,\n                p.id as product_id,\n                p.name as product_name,\n                p.is_active as product_is_active,\n                p.is_draft as product_is_draft,\n                p.version as product_version,\n                coalesce(cast(l."YOM" as text), \'\') || \' \' || coalesce((string_agg(m.name, \' \')), \'\') || \' \' || p.name as title, \n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                ls.name as listing_status,\n                a.business_name as submitted_by, \n                l.create_at\n        from public.listing l\n        inner join product p on l."productId" = p.id \n        inner join listing_status ls on ls.id = l."listingStatusId"\n        inner join account a on l."accountId" = a.id \n        left join listing_image li on li."listingId" = l.id and li.order = 0\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer\n        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null\n        group by l.id, p.id, li.id, a.id, ls.id',
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['VIEW', 'public', 'listings_approval_view']
        );
        await queryRunner.query(`DROP VIEW "listings_approval_view"`);
        await queryRunner.query(`CREATE VIEW "listings_approval_view" AS select 	l.id, 
                l.version as version,
                a.id as account_id,
                p.id as product_id,
                p.is_active as product_is_active,
                p.is_draft as product_is_draft,
                coalesce(cast(l."YOM" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, 
                li.key as thumbnail_key,
                li.bucket as thumbnail_bucket,
                li.region as thumbnail_region,
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
        and ls.name = 'Pending Review'
        group by l.id, p.id, li.id, a.id`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'VIEW',
                'public',
                'listings_approval_view',
                "select \tl.id, \n                l.version as version,\n                a.id as account_id,\n                p.id as product_id,\n                p.is_active as product_is_active,\n                p.is_draft as product_is_draft,\n                coalesce(cast(l.\"YOM\" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, \n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                a.business_name as submitted_by, \n                p.create_at\n        from public.listing l\n        inner join product p on l.\"productId\" = p.id \n        inner join listing_status ls on ls.id = l.\"listingStatusId\"\n        inner join account a on l.\"accountId\" = a.id \n        left join listing_image li on li.\"listingId\" = l.id and li.order = 0\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer\n        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null\n        and ls.name = 'Pending Review'\n        group by l.id, p.id, li.id, a.id",
            ]
        );
    }
}
