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
exports.AlterSearchView1642036412719 = void 0;
class AlterSearchView1642036412719 {
    constructor() {
        this.name = 'AlterSearchView1642036412719';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'live_listings_advanced_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "live_listings_advanced_view"`);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_advanced_view" AS 
        select  l.id,
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
    group by l.id, p.id, li.id, m.id, c.id
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_advanced_view',
                "select  l.id,\n        p.id as \"productId\",\n        l.\"YOM\",\n        p.name as \"productName\",\n        m.name as \"manufacturer\",\n        l.\"cost\" as price,\n        l.create_at as created_on,\n        li.key as thumbnail_key,\n        li.bucket as thumbnail_bucket,\n        li.region as thumbnail_region,\n        c.id as category,\n        setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n        setweight(to_tsvector(p.name), 'B') || ' ' || \n        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n        as document\n    from listing l\n    inner join product p on l.\"productId\" = p.id \n    inner join listing_status ls on ls.id = l.\"listingStatusId\"\n    left join category_to_product ctp on ctp.product = p.id\n    left join category c on c.id = ctp.category\n    left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    where ls.name = 'Listed' \n    and p.is_active = '1' \n    and p.is_draft = '0'\n    group by l.id, p.id, li.id, m.id, c.id",
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'live_listings_advanced_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "live_listings_advanced_view"`);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_advanced_view" AS select  l.id,
        p.id as "productId",
        (select  l."YOM" || ' ' || coalesce((string_agg(man.name, ' ')), '') from manufacturer man inner join product_to_manufacturer ptm2 on man.id = ptm2.manufacturer where ptm2.product = p.id group by ptm2.product) || ' ' || p.name as title,
        l."cost" as price,
        li.key as thumbnail_key,
        li.bucket as thumbnail_bucket,
        li.region as thumbnail_region,
        m.name as manufacturer,
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
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_advanced_view',
                "select  l.id,\n        p.id as \"productId\",\n        (select  l.\"YOM\" || ' ' || coalesce((string_agg(man.name, ' ')), '') from manufacturer man inner join product_to_manufacturer ptm2 on man.id = ptm2.manufacturer where ptm2.product = p.id group by ptm2.product) || ' ' || p.name as title,\n        l.\"cost\" as price,\n        li.key as thumbnail_key,\n        li.bucket as thumbnail_bucket,\n        li.region as thumbnail_region,\n        m.name as manufacturer,\n        c.id as category,\n        setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n        setweight(to_tsvector(p.name), 'B') || ' ' || \n        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n        as document \n    from listing l\n    inner join product p on l.\"productId\" = p.id \n    inner join listing_status ls on ls.id = l.\"listingStatusId\"\n    left join category_to_product ctp on ctp.product = p.id\n    left join category c on c.id = ctp.category\n    left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    where ls.name = 'Listed' \n    and p.is_active = '1' \n    and p.is_draft = '0'\n    group by l.id, p.id, li.id, m.id, c.id",
            ]);
        });
    }
}
exports.AlterSearchView1642036412719 = AlterSearchView1642036412719;
