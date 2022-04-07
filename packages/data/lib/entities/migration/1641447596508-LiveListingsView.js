"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveListingsView1641447596508 = void 0;
class LiveListingsView1641447596508 {
    constructor() {
        this.name = 'LiveListingsView1641447596508';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['VIEW', 'public', 'listings_approval_view']);
            yield queryRunner.query(`DROP VIEW "listings_approval_view"`);
            yield queryRunner.query(`CREATE VIEW "listings_approval_view" AS 
        select 	l.id, 
                p.id as product_id,
                p.is_active as product_is_active,
                p.is_draft as product_is_draft,
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name || ' ' || l."YOM" as title, 
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
        group by l.id, p.id, li.id, a.id
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'VIEW',
                'public',
                'listings_approval_view',
                'select \tl.id, \n                p.id as product_id,\n                p.is_active as product_is_active,\n                p.is_draft as product_is_draft,\n                coalesce((string_agg(m.name, \' \')), \'\') || \' \' || p.name || \' \' || l."YOM" as title, \n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                a.business_name as submitted_by, \n                p.create_at\n        from public.listing l\n        inner join product p on l."productId" = p.id \n        inner join listing_status ls on ls.id = l."listingStatusId"\n        inner join account a on l."accountId" = a.id \n        left join listing_image li on li."listingId" = l.id and li.order = 0\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer\n        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null\n        and ls.name = \'Pending Review\'\n        group by l.id, p.id, li.id, a.id',
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_fuzzy_search_view" AS 
        select word from ts_stat(
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
        )
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_fuzzy_search_view',
                "select word from ts_stat(\n            'select setweight(to_tsvector(cast(l.\"YOM\" as text)), ''A'') || '' '' || setweight(to_tsvector(''simple'', p.name), ''B'') || '' '' || \n                setweight(to_tsvector(''simple'', coalesce((string_agg(m.name, '' '')), '''')), ''C'') \n                as document \n            from listing l\n            inner join product p on l.\"productId\" = p.id \n            inner join listing_status ls on ls.id = l.\"listingStatusId\" \n            left join product_to_manufacturer ptm on ptm.product = p.id\n            left join manufacturer m on m.id = ptm.manufacturer \n            where ls.name = ''Listed'' \n            and p.is_active = ''1'' \n            and p.is_draft = ''0''\n            group by l.id, p.id'\n        )",
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_search_view" AS 
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
        inner join product p on l."productId" = p.id 
        inner join listing_status ls on ls.id = l."listingStatusId"
        left join category_function_to_product cftp on cftp.product = p.id
        left join category_function cf on cf.id = cftp.category_function 
        left join category_type ct on ct.id = cf."categoryTypeId" 
        left join category c on c.id = ct."categoryId" 
        left join listing_image li on li."listingId" = l.id and li.order = 0 and li.deleted_date is null
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        where ls.name = 'Listed' 
        and p.is_active = '1' 
        and p.is_draft = '0'
        group by l.id, p.id, li.id
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_search_view',
                "select  l.id,\n                p.id as \"productId\",\n                l.\"YOM\" || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, \n                l.\"cost\" as price,\n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n                setweight(to_tsvector(p.name), 'B') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n                as document \n        from listing l\n        inner join product p on l.\"productId\" = p.id \n        inner join listing_status ls on ls.id = l.\"listingStatusId\"\n        left join category_function_to_product cftp on cftp.product = p.id\n        left join category_function cf on cf.id = cftp.category_function \n        left join category_type ct on ct.id = cf.\"categoryTypeId\" \n        left join category c on c.id = ct.\"categoryId\" \n        left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        where ls.name = 'Listed' \n        and p.is_active = '1' \n        and p.is_draft = '0'\n        group by l.id, p.id, li.id",
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_advanced_view" AS 
        select  l.id,
                p.id as "productId",
                (select  l."YOM" || ' ' || coalesce((string_agg(man.name, ' ')), '') from manufacturer man inner join product_to_manufacturer ptm2 on man.id = ptm2.manufacturer where ptm2.product = p.id group by ptm2.product) || ' ' || p.name as title,
                l."cost" as price,
                li.key as thumbnail_key,
                li.bucket as thumbnail_bucket,
                li.region as thumbnail_region,
                m.name as manufacturer,
                c.id as category,
                ct.id as "categoryType",
                cf.id as "categoryFunction",
                setweight(to_tsvector(cast(l."YOM" as text)), 'A') || ' ' ||
                setweight(to_tsvector(p.name), 'B') || ' ' || 
                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') 
                as document 
	from listing l
	inner join product p on l."productId" = p.id 
	inner join listing_status ls on ls.id = l."listingStatusId"
	left join category_function_to_product cftp on cftp.product = p.id
	left join category_function cf on cf.id = cftp.category_function 
	left join category_type ct on ct.id = cf."categoryTypeId" 
	left join category c on c.id = ct."categoryId" 
	left join listing_image li on li."listingId" = l.id and li.order = 0 and li.deleted_date is null
	left join product_to_manufacturer ptm on ptm.product = p.id
	left join manufacturer m on m.id = ptm.manufacturer 
	where ls.name = 'Listed' 
	and p.is_active = '1' 
	and p.is_draft = '0'
	group by l.id, p.id, li.id, m.id, c.id, ct.id, cf.id
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_advanced_view',
                "select  l.id,\n                p.id as \"productId\",\n                (select  l.\"YOM\" || ' ' || coalesce((string_agg(man.name, ' ')), '') from manufacturer man inner join product_to_manufacturer ptm2 on man.id = ptm2.manufacturer where ptm2.product = p.id group by ptm2.product) || ' ' || p.name as title,\n                l.\"cost\" as price,\n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                m.name as manufacturer,\n                c.id as category,\n                ct.id as \"categoryType\",\n                cf.id as \"categoryFunction\",\n                setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n                setweight(to_tsvector(p.name), 'B') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n                as document \n\tfrom listing l\n\tinner join product p on l.\"productId\" = p.id \n\tinner join listing_status ls on ls.id = l.\"listingStatusId\"\n\tleft join category_function_to_product cftp on cftp.product = p.id\n\tleft join category_function cf on cf.id = cftp.category_function \n\tleft join category_type ct on ct.id = cf.\"categoryTypeId\" \n\tleft join category c on c.id = ct.\"categoryId\" \n\tleft join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n\tleft join product_to_manufacturer ptm on ptm.product = p.id\n\tleft join manufacturer m on m.id = ptm.manufacturer \n\twhere ls.name = 'Listed' \n\tand p.is_active = '1' \n\tand p.is_draft = '0'\n\tgroup by l.id, p.id, li.id, m.id, c.id, ct.id, cf.id",
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "category_look_up" AS 
        select c.id as category_id, 0 as category_type_id, 0 as category_function_id, c.name as guid, 1 as depth from category c 
        union
        select c.id as category_id, ct.id as category_type_id, 0 as category_function_id, c.name || '|' || ct.name as guid, 2 as depth from category c 
        inner join category_type ct on c.id = ct."categoryId" 
        union
        select c.id as category_id, ct.id as category_type_id, cf.id as category_function_id, c.name || '|' || ct.name || '_' || cf.name as guid, 3 as depth from category c 
        inner join category_type ct on c.id = ct."categoryId" 
        inner join category_function cf on cf."categoryTypeId" = ct.id 
        order by depth
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'category_look_up',
                'select c.id as category_id, 0 as category_type_id, 0 as category_function_id, c.name as guid, 1 as depth from category c \n        union\n        select c.id as category_id, ct.id as category_type_id, 0 as category_function_id, c.name || \'|\' || ct.name as guid, 2 as depth from category c \n        inner join category_type ct on c.id = ct."categoryId" \n        union\n        select c.id as category_id, ct.id as category_type_id, cf.id as category_function_id, c.name || \'|\' || ct.name || \'_\' || cf.name as guid, 3 as depth from category c \n        inner join category_type ct on c.id = ct."categoryId" \n        inner join category_function cf on cf."categoryTypeId" = ct.id \n        order by depth',
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'category_look_up']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "category_look_up"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'live_listings_advanced_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "live_listings_advanced_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'live_listings_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "live_listings_search_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'live_listings_fuzzy_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "live_listings_fuzzy_search_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['VIEW', 'public', 'listings_approval_view']);
            yield queryRunner.query(`DROP VIEW "listings_approval_view"`);
            yield queryRunner.query(`CREATE VIEW "listings_approval_view" AS select 	l.id, 
                p.id as product_id,
                p.is_active as product_is_active,
                p.is_draft as product_is_draft,
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name || ' ' || l."YOM" as title, 
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
        and ls.name = 'Submitted'
        group by l.id, p.id, li.id, a.id`);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'VIEW',
                'public',
                'listings_approval_view',
                'select \tl.id, \n                p.id as product_id,\n                p.is_active as product_is_active,\n                p.is_draft as product_is_draft,\n                coalesce((string_agg(m.name, \' \')), \'\') || \' \' || p.name || \' \' || l."YOM" as title, \n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                a.business_name as submitted_by, \n                p.create_at\n        from public.listing l\n        inner join product p on l."productId" = p.id \n        inner join listing_status ls on ls.id = l."listingStatusId"\n        inner join account a on l."accountId" = a.id \n        left join listing_image li on li."listingId" = l.id and li.order = 0\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer\n        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null\n        and ls.name = \'Submitted\'\n        group by l.id, p.id, li.id, a.id',
            ]);
        });
    }
}
exports.LiveListingsView1641447596508 = LiveListingsView1641447596508;
//# sourceMappingURL=1641447596508-LiveListingsView.js.map