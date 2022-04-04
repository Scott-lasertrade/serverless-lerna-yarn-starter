import { MigrationInterface, QueryRunner } from 'typeorm';

export class addListingStockCount1642376633955 implements MigrationInterface {
    name = 'addListingStockCount1642376633955';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['MATERIALIZED_VIEW', 'public', 'live_listings_advanced_view']
        );
        await queryRunner.query(
            `DROP MATERIALIZED VIEW "live_listings_advanced_view"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" ADD "stock" integer NOT NULL DEFAULT '1'`
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
    group by l.id, p.id, li.id, m.id, c.id
    `);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_advanced_view',
                "select  l.id,\n        p.id as \"productId\",\n        l.\"YOM\",\n        p.name as \"productName\",\n        m.name as \"manufacturer\",\n        l.\"cost\" as price,\n        l.stock,\n        l.create_at as created_on,\n        li.key as thumbnail_key,\n        li.bucket as thumbnail_bucket,\n        li.region as thumbnail_region,\n        c.id as category,\n        setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n        setweight(to_tsvector(p.name), 'B') || ' ' || \n        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n        as document\n    from listing l\n    inner join product p on l.\"productId\" = p.id \n    inner join listing_status ls on ls.id = l.\"listingStatusId\"\n    left join category_to_product ctp on ctp.product = p.id\n    left join category c on c.id = ctp.category\n    left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    where ls.name = 'Listed' \n    and p.is_active = '1' \n    and p.is_draft = '0'\n    group by l.id, p.id, li.id, m.id, c.id",
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
        await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "stock"`);
        await queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_advanced_view" AS select  l.id,
        p.id as "productId",
        l."YOM",
        p.name as "productName",
        m.name as "manufacturer",
        l."cost" as price,
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
                "select  l.id,\n        p.id as \"productId\",\n        l.\"YOM\",\n        p.name as \"productName\",\n        m.name as \"manufacturer\",\n        l.\"cost\" as price,\n        l.create_at as created_on,\n        li.key as thumbnail_key,\n        li.bucket as thumbnail_bucket,\n        li.region as thumbnail_region,\n        c.id as category,\n        setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n        setweight(to_tsvector(p.name), 'B') || ' ' || \n        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n        as document\n    from listing l\n    inner join product p on l.\"productId\" = p.id \n    inner join listing_status ls on ls.id = l.\"listingStatusId\"\n    left join category_to_product ctp on ctp.product = p.id\n    left join category c on c.id = ctp.category\n    left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    where ls.name = 'Listed' \n    and p.is_active = '1' \n    and p.is_draft = '0'\n    group by l.id, p.id, li.id, m.id, c.id",
            ]
        );
    }
}
