import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateProductSubmissionsView1643081304572
    implements MigrationInterface
{
    name = 'updateProductSubmissionsView1643081304572';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['MATERIALIZED_VIEW', 'public', 'live_listings_search_view']
        );
        await queryRunner.query(
            `DROP MATERIALIZED VIEW "live_listings_search_view"`
        );
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['MATERIALIZED_VIEW', 'public', 'live_listings_advanced_view']
        );
        await queryRunner.query(
            `DROP MATERIALIZED VIEW "live_listings_advanced_view"`
        );
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['VIEW', 'public', 'product_submissions_view']
        );
        await queryRunner.query(`DROP VIEW "product_submissions_view"`);
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['MATERIALIZED_VIEW', 'public', 'live_listings_fuzzy_search_view']
        );
        await queryRunner.query(
            `DROP MATERIALIZED VIEW "live_listings_fuzzy_search_view"`
        );
        await queryRunner.query(`CREATE VIEW "product_submissions_view" AS 
        select 	p.id, 
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
                pi2.key as thumbnail_key,
                pi2.bucket as thumbnail_bucket,
                pi2.region as thumbnail_region,
                p.create_at,
                case when COUNT(CASE WHEN m.is_approved THEN null else 1 END) > 0 then 1 else 0 end as requires_approval
        from public.product p
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
        where p.id in (select "productId" from listing where "productId" = p.id) And p.deleted_date is null and pi2.deleted_date is null
        and p.is_active = '1' and p.is_draft = '1'
        group by p.id, pi2.id
    `);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'VIEW',
                'public',
                'product_submissions_view',
                "select \tp.id, \n            coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, \n            pi2.key as thumbnail_key,\n            pi2.bucket as thumbnail_bucket,\n            pi2.region as thumbnail_region,\n            p.create_at,\n            case when COUNT(CASE WHEN m.is_approved THEN null else 1 END) > 0 then 1 else 0 end as requires_approval\n    from public.product p\n    inner join listing l on l.\"productId\" = p.id\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    left join product_image pi2 on pi2.\"productId\" = p.id and pi2.order = 0\n    where p.deleted_date is null and pi2.deleted_date is null\n    and p.is_active = '1' and p.is_draft = '1'\n    group by p.id, pi2.id",
            ]
        );
        await queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_fuzzy_search_view" AS 
        select word from ts_stat(
            'select setweight(to_tsvector(cast(l."YOM" as text)), ''A'') || '' '' || setweight(to_tsvector(''simple'', p.name), ''B'') || '' '' || 
                setweight(to_tsvector(''simple'', coalesce((string_agg(m.name, '' '')), '''')), ''C'') 
                as document 
            from listing l
            inner join product p on l."productId" = p.id and p.deleted_date is null
            inner join listing_status ls on ls.id = l."listingStatusId" 
            left join product_to_manufacturer ptm on ptm.product = p.id
            left join manufacturer m on m.id = ptm.manufacturer 
            where ls.name = ''Listed'' 
            and p.is_active = ''1'' 
            and p.is_draft = ''0''
            group by l.id, p.id'
        )
    `);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_fuzzy_search_view',
                "select word from ts_stat(\n            'select setweight(to_tsvector(cast(l.\"YOM\" as text)), ''A'') || '' '' || setweight(to_tsvector(''simple'', p.name), ''B'') || '' '' || \n                setweight(to_tsvector(''simple'', coalesce((string_agg(m.name, '' '')), '''')), ''C'') \n                as document \n            from listing l\n            inner join product p on l.\"productId\" = p.id and p.deleted_date is null\n            inner join listing_status ls on ls.id = l.\"listingStatusId\" \n            left join product_to_manufacturer ptm on ptm.product = p.id\n            left join manufacturer m on m.id = ptm.manufacturer \n            where ls.name = ''Listed'' \n            and p.is_active = ''1'' \n            and p.is_draft = ''0''\n            group by l.id, p.id'\n        )",
            ]
        );
        await queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_search_view" AS 
        select  l.id,
                p.id as "productId",
                l."YOM" || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, 
                l."cost" as price,
                li.key as thumbnail_key,
                li.bucket as thumbnail_bucket,
                li.region as thumbnail_region,
                setweight(to_tsvector(cast(l."YOM" as text)), 'A') || ' ' ||
                setweight(to_tsvector(p.name), 'B') || ' ' || 
                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') 
                as document 
        from listing l
        inner join product p on l."productId" = p.id and p.deleted_date is null
        inner join listing_status ls on ls.id = l."listingStatusId"
        left join listing_image li on li."listingId" = l.id and li.order = 0 and li.deleted_date is null
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        where ls.name = 'Listed' 
        and p.is_active = '1' 
        and p.is_draft = '0'
        group by l.id, p.id, li.id
    `);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_search_view',
                "select  l.id,\n                p.id as \"productId\",\n                l.\"YOM\" || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, \n                l.\"cost\" as price,\n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n                setweight(to_tsvector(p.name), 'B') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n                as document \n        from listing l\n        inner join product p on l.\"productId\" = p.id and p.deleted_date is null\n        inner join listing_status ls on ls.id = l.\"listingStatusId\"\n        left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        where ls.name = 'Listed' \n        and p.is_active = '1' \n        and p.is_draft = '0'\n        group by l.id, p.id, li.id",
            ]
        );
        await queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_advanced_view" AS 
        select  l.id,
        p.id as "productId",
        l."YOM",
        p.name as "productName",
        m.name as "manufacturer",
        l."cost" as price,
        l.stock,
        l.create_at as created_on,
        li.key as thumbnail_key,
        li.bucket as thumbnail_bucket,
        li.region as thumbnail_region,
        c.id as category,
        setweight(to_tsvector(cast(l."YOM" as text)), 'A') || ' ' ||
        setweight(to_tsvector(p.name), 'B') || ' ' || 
        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') 
        as document
    from listing l
    inner join product p on l."productId" = p.id and p.deleted_date is null
    inner join listing_status ls on ls.id = l."listingStatusId"
    left join category_to_product ctp on ctp.product = p.id
    left join category c on c.id = ctp.category
    left join listing_image li on li."listingId" = l.id and li.order = 0 and li.deleted_date is null
    left join product_to_manufacturer ptm on ptm.product = p.id
    left join manufacturer m on m.id = ptm.manufacturer 
    where ls.name = 'Listed' 
    and p.is_active = '1' 
    and p.is_draft = '0'
    group by l.id, p.id, li.id, m.id, c.id
    `);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_advanced_view',
                "select  l.id,\n        p.id as \"productId\",\n        l.\"YOM\",\n        p.name as \"productName\",\n        m.name as \"manufacturer\",\n        l.\"cost\" as price,\n        l.stock,\n        l.create_at as created_on,\n        li.key as thumbnail_key,\n        li.bucket as thumbnail_bucket,\n        li.region as thumbnail_region,\n        c.id as category,\n        setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n        setweight(to_tsvector(p.name), 'B') || ' ' || \n        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n        as document\n    from listing l\n    inner join product p on l.\"productId\" = p.id and p.deleted_date is null\n    inner join listing_status ls on ls.id = l.\"listingStatusId\"\n    left join category_to_product ctp on ctp.product = p.id\n    left join category c on c.id = ctp.category\n    left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    where ls.name = 'Listed' \n    and p.is_active = '1' \n    and p.is_draft = '0'\n    group by l.id, p.id, li.id, m.id, c.id",
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['MATERIALIZED_VIEW', 'public', 'live_listings_advanced_view']
        );
        await queryRunner.query(
            `DROP MATERIALIZED VIEW "live_listings_advanced_view"`
        );
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['MATERIALIZED_VIEW', 'public', 'live_listings_search_view']
        );
        await queryRunner.query(
            `DROP MATERIALIZED VIEW "live_listings_search_view"`
        );
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['MATERIALIZED_VIEW', 'public', 'live_listings_fuzzy_search_view']
        );
        await queryRunner.query(
            `DROP MATERIALIZED VIEW "live_listings_fuzzy_search_view"`
        );
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['VIEW', 'public', 'product_submissions_view']
        );
        await queryRunner.query(`DROP VIEW "product_submissions_view"`);
        await queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_fuzzy_search_view" AS select word from ts_stat(
            'select setweight(to_tsvector(cast(l."YOM" as text)), ''A'') || '' '' || setweight(to_tsvector(''simple'', p.name), ''B'') || '' '' || 
                setweight(to_tsvector(''simple'', coalesce((string_agg(m.name, '' '')), '''')), ''C'') 
                as document 
            from listing l
            inner join product p on l."productId" = p.id 
            inner join listing_status ls on ls.id = l."listingStatusId" 
            left join product_to_manufacturer ptm on ptm.product = p.id
            left join manufacturer m on m.id = ptm.manufacturer 
            where ls.name = ''Listed'' 
            and p.is_active = ''1'' 
            and p.is_draft = ''0''
            group by l.id, p.id'
        )`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_fuzzy_search_view',
                "select word from ts_stat(\n            'select setweight(to_tsvector(cast(l.\"YOM\" as text)), ''A'') || '' '' || setweight(to_tsvector(''simple'', p.name), ''B'') || '' '' || \n                setweight(to_tsvector(''simple'', coalesce((string_agg(m.name, '' '')), '''')), ''C'') \n                as document \n            from listing l\n            inner join product p on l.\"productId\" = p.id \n            inner join listing_status ls on ls.id = l.\"listingStatusId\" \n            left join product_to_manufacturer ptm on ptm.product = p.id\n            left join manufacturer m on m.id = ptm.manufacturer \n            where ls.name = ''Listed'' \n            and p.is_active = ''1'' \n            and p.is_draft = ''0''\n            group by l.id, p.id'\n        )",
            ]
        );
        await queryRunner.query(`CREATE VIEW "product_submissions_view" AS select 	p.id, 
            coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
            pi2.key as thumbnail_key,
            pi2.bucket as thumbnail_bucket,
            pi2.region as thumbnail_region,
            p.create_at,
            case when COUNT(CASE WHEN m.is_approved THEN null else 1 END) > 0 then 1 else 0 end as requires_approval
    from public.product p
    left join product_to_manufacturer ptm on ptm.product = p.id
    left join manufacturer m on m.id = ptm.manufacturer 
    left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
    where p.deleted_date is null and pi2.deleted_date is null
    and p.is_active = '1' and p.is_draft = '1'
    group by p.id, pi2.id`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'VIEW',
                'public',
                'product_submissions_view',
                "select \tp.id, \n            coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, \n            pi2.key as thumbnail_key,\n            pi2.bucket as thumbnail_bucket,\n            pi2.region as thumbnail_region,\n            p.create_at,\n            case when COUNT(CASE WHEN m.is_approved THEN null else 1 END) > 0 then 1 else 0 end as requires_approval\n    from public.product p\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    left join product_image pi2 on pi2.\"productId\" = p.id and pi2.order = 0\n    where p.deleted_date is null and pi2.deleted_date is null\n    and p.is_active = '1' and p.is_draft = '1'\n    group by p.id, pi2.id",
            ]
        );
        await queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_advanced_view" AS select  l.id,
        p.id as "productId",
        l."YOM",
        p.name as "productName",
        m.name as "manufacturer",
        l."cost" as price,
        l.stock,
        l.create_at as created_on,
        li.key as thumbnail_key,
        li.bucket as thumbnail_bucket,
        li.region as thumbnail_region,
        c.id as category,
        setweight(to_tsvector(cast(l."YOM" as text)), 'A') || ' ' ||
        setweight(to_tsvector(p.name), 'B') || ' ' || 
        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') 
        as document
    from listing l
    inner join product p on l."productId" = p.id 
    inner join listing_status ls on ls.id = l."listingStatusId"
    left join category_to_product ctp on ctp.product = p.id
    left join category c on c.id = ctp.category
    left join listing_image li on li."listingId" = l.id and li.order = 0 and li.deleted_date is null
    left join product_to_manufacturer ptm on ptm.product = p.id
    left join manufacturer m on m.id = ptm.manufacturer 
    where ls.name = 'Listed' 
    and p.is_active = '1' 
    and p.is_draft = '0'
    group by l.id, p.id, li.id, m.id, c.id`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_advanced_view',
                "select  l.id,\n        p.id as \"productId\",\n        l.\"YOM\",\n        p.name as \"productName\",\n        m.name as \"manufacturer\",\n        l.\"cost\" as price,\n        l.stock,\n        l.create_at as created_on,\n        li.key as thumbnail_key,\n        li.bucket as thumbnail_bucket,\n        li.region as thumbnail_region,\n        c.id as category,\n        setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n        setweight(to_tsvector(p.name), 'B') || ' ' || \n        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n        as document\n    from listing l\n    inner join product p on l.\"productId\" = p.id \n    inner join listing_status ls on ls.id = l.\"listingStatusId\"\n    left join category_to_product ctp on ctp.product = p.id\n    left join category c on c.id = ctp.category\n    left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    where ls.name = 'Listed' \n    and p.is_active = '1' \n    and p.is_draft = '0'\n    group by l.id, p.id, li.id, m.id, c.id",
            ]
        );
        await queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_search_view" AS select  l.id,
                p.id as "productId",
                l."YOM" || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, 
                l."cost" as price,
                li.key as thumbnail_key,
                li.bucket as thumbnail_bucket,
                li.region as thumbnail_region,
                setweight(to_tsvector(cast(l."YOM" as text)), 'A') || ' ' ||
                setweight(to_tsvector(p.name), 'B') || ' ' || 
                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') 
                as document 
        from listing l
        inner join product p on l."productId" = p.id 
        inner join listing_status ls on ls.id = l."listingStatusId"
        left join listing_image li on li."listingId" = l.id and li.order = 0 and li.deleted_date is null
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        where ls.name = 'Listed' 
        and p.is_active = '1' 
        and p.is_draft = '0'
        group by l.id, p.id, li.id`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_search_view',
                "select  l.id,\n                p.id as \"productId\",\n                l.\"YOM\" || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, \n                l.\"cost\" as price,\n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n                setweight(to_tsvector(p.name), 'B') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n                as document \n        from listing l\n        inner join product p on l.\"productId\" = p.id \n        inner join listing_status ls on ls.id = l.\"listingStatusId\"\n        left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        where ls.name = 'Listed' \n        and p.is_active = '1' \n        and p.is_draft = '0'\n        group by l.id, p.id, li.id",
            ]
        );
    }
}
