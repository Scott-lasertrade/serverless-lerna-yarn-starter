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
exports.userViewTracking1643095402404 = void 0;
class userViewTracking1643095402404 {
    constructor() {
        this.name = 'userViewTracking1643095402404';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'live_listings_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "live_listings_search_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['VIEW', 'public', 'product_submissions_view']);
            yield queryRunner.query(`DROP VIEW "product_submissions_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['VIEW', 'public', 'listings_approval_view']);
            yield queryRunner.query(`DROP VIEW "listings_approval_view"`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23T05:00:30.006Z'`);
            yield queryRunner.query(`CREATE VIEW "product_submissions_view" AS 
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
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'VIEW',
                'public',
                'product_submissions_view',
                "select \tp.id, \n            coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, \n            pi2.key as thumbnail_key,\n            pi2.bucket as thumbnail_bucket,\n            pi2.region as thumbnail_region,\n            p.create_at,\n            case when COUNT(CASE WHEN m.is_approved THEN null else 1 END) > 0 then 1 else 0 end as requires_approval\n    from public.product p\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    left join product_image pi2 on pi2.\"productId\" = p.id and pi2.order = 0\n    where p.id in (select \"productId\" from listing where \"productId\" = p.id) And p.deleted_date is null and pi2.deleted_date is null\n    and p.is_active = '1' and p.is_draft = '1'\n    group by p.id, pi2.id",
            ]);
            yield queryRunner.query(`CREATE VIEW "listings_approval_view" AS 
        select 	l.id, 
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
        group by l.id, p.id, li.id, a.id
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'VIEW',
                'public',
                'listings_approval_view',
                "select \tl.id, \n                l.version as version,\n                a.id as account_id,\n                p.id as product_id,\n                p.is_active as product_is_active,\n                p.is_draft as product_is_draft,\n                coalesce(cast(l.\"YOM\" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, \n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                a.business_name as submitted_by, \n                p.create_at\n        from public.listing l\n        inner join product p on l.\"productId\" = p.id \n        inner join listing_status ls on ls.id = l.\"listingStatusId\"\n        inner join account a on l.\"accountId\" = a.id \n        left join listing_image li on li.\"listingId\" = l.id and li.order = 0\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer\n        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null\n        and ls.name = 'Pending Review'\n        group by l.id, p.id, li.id, a.id",
            ]);
            yield queryRunner.query(`CREATE VIEW "listing_seller_view" AS 
        select  l.id as listing_id, 
                ls."name" as listing_status, 
                p.id as product_id, 
                coalesce(cast(l."YOM" as text), '') || ' ' || cast(coalesce((string_agg(m.name, ' ')), 'JOIN') as text) || ' ' || p.name as product_name, 
                lister.cognito_user_id as lister_id 
        from listing l
        left join listing_status ls on ls.id = l."listingStatusId" 
        left join product p on l."productId" = p.id
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join account LA on l."accountId" = LA.id
        left join account_to_user LTU on LTU.account = LA.id
        left join public.user lister on LTU.user = lister.id
        group by l.id, ls.name, p.id, l."YOM", p.name, lister.cognito_user_id
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'VIEW',
                'public',
                'listing_seller_view',
                'select  l.id as listing_id, \n                ls."name" as listing_status, \n                p.id as product_id, \n                coalesce(cast(l."YOM" as text), \'\') || \' \' || cast(coalesce((string_agg(m.name, \' \')), \'JOIN\') as text) || \' \' || p.name as product_name, \n                lister.cognito_user_id as lister_id \n        from listing l\n        left join listing_status ls on ls.id = l."listingStatusId" \n        left join product p on l."productId" = p.id\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join account LA on l."accountId" = LA.id\n        left join account_to_user LTU on LTU.account = LA.id\n        left join public.user lister on LTU.user = lister.id\n        group by l.id, ls.name, p.id, l."YOM", p.name, lister.cognito_user_id',
            ]);
            yield queryRunner.query(`CREATE VIEW "offer_relation_view" AS 
        select  o.id as offer_id, 
                os.name as offer_status, 
                l.id as listing_id, 
                ls.name as listing_status, 
                p.id as product_id, 
                coalesce(cast(l."YOM" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as product_name, 
                buyer.cognito_user_id as buyer_id, 
                seller.cognito_user_id as seller_id 
        from offer o
        left join offer_status os on o."statusId" = os.id 
        left join account BA on o."accountId" = BA.id
        left join account_to_user BTU on BTU.account = BA.id
        left join public.user buyer on BTU.user = buyer.id
        left join listing l on o."listingId" = l.id
        left join listing_status ls on ls.id = l."listingStatusId" 
        left join product p on l."productId" = p.id
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join account SA on l."accountId" = SA.id
        left join account_to_user STU on STU.account = SA.id
        left join public.user seller on STU.user = seller.id
        group by o.id, os.name, l.id, ls.name, p.id, l."YOM", p.name, buyer.cognito_user_id, seller.cognito_user_id
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'VIEW',
                'public',
                'offer_relation_view',
                'select  o.id as offer_id, \n                os.name as offer_status, \n                l.id as listing_id, \n                ls.name as listing_status, \n                p.id as product_id, \n                coalesce(cast(l."YOM" as text), \'\') || \' \' || coalesce((string_agg(m.name, \' \')), \'\') || \' \' || p.name as product_name, \n                buyer.cognito_user_id as buyer_id, \n                seller.cognito_user_id as seller_id \n        from offer o\n        left join offer_status os on o."statusId" = os.id \n        left join account BA on o."accountId" = BA.id\n        left join account_to_user BTU on BTU.account = BA.id\n        left join public.user buyer on BTU.user = buyer.id\n        left join listing l on o."listingId" = l.id\n        left join listing_status ls on ls.id = l."listingStatusId" \n        left join product p on l."productId" = p.id\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join account SA on l."accountId" = SA.id\n        left join account_to_user STU on STU.account = SA.id\n        left join public.user seller on STU.user = seller.id\n        group by o.id, os.name, l.id, ls.name, p.id, l."YOM", p.name, buyer.cognito_user_id, seller.cognito_user_id',
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_search_view" AS 
        select  l.id,
                p.id as "productId",
                coalesce(cast(l."YOM" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, 
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
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_search_view',
                "select  l.id,\n                p.id as \"productId\",\n                coalesce(cast(l.\"YOM\" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, \n                l.\"cost\" as price,\n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n                setweight(to_tsvector(p.name), 'B') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n                as document \n        from listing l\n        inner join product p on l.\"productId\" = p.id and p.deleted_date is null\n        inner join listing_status ls on ls.id = l.\"listingStatusId\"\n        left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        where ls.name = 'Listed' \n        and p.is_active = '1' \n        and p.is_draft = '0'\n        group by l.id, p.id, li.id",
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'live_listings_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "live_listings_search_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['VIEW', 'public', 'offer_relation_view']);
            yield queryRunner.query(`DROP VIEW "offer_relation_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['VIEW', 'public', 'listing_seller_view']);
            yield queryRunner.query(`DROP VIEW "listing_seller_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['VIEW', 'public', 'listings_approval_view']);
            yield queryRunner.query(`DROP VIEW "listings_approval_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['VIEW', 'public', 'product_submissions_view']);
            yield queryRunner.query(`DROP VIEW "product_submissions_view"`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`);
            yield queryRunner.query(`CREATE VIEW "listings_approval_view" AS select 	l.id, 
                l.version as version,
                a.id as account_id,
                p.id as product_id,
                p.is_active as product_is_active,
                p.is_draft as product_is_draft,
                l."YOM" || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, 
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
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'VIEW',
                'public',
                'listings_approval_view',
                'select \tl.id, \n                l.version as version,\n                a.id as account_id,\n                p.id as product_id,\n                p.is_active as product_is_active,\n                p.is_draft as product_is_draft,\n                l."YOM" || \' \' || coalesce((string_agg(m.name, \' \')), \'\') || \' \' || p.name as title, \n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                a.business_name as submitted_by, \n                p.create_at\n        from public.listing l\n        inner join product p on l."productId" = p.id \n        inner join listing_status ls on ls.id = l."listingStatusId"\n        inner join account a on l."accountId" = a.id \n        left join listing_image li on li."listingId" = l.id and li.order = 0\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer\n        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null\n        and ls.name = \'Pending Review\'\n        group by l.id, p.id, li.id, a.id',
            ]);
            yield queryRunner.query(`CREATE VIEW "product_submissions_view" AS select 	p.id, 
            coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
            pi2.key as thumbnail_key,
            pi2.bucket as thumbnail_bucket,
            pi2.region as thumbnail_region,
            p.create_at,
            case when COUNT(CASE WHEN m.is_approved THEN null else 1 END) > 0 then 1 else 0 end as requires_approval
    from public.product p
    inner join listing l on l."productId" = p.id
    left join product_to_manufacturer ptm on ptm.product = p.id
    left join manufacturer m on m.id = ptm.manufacturer 
    left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
    where p.deleted_date is null and pi2.deleted_date is null
    and p.is_active = '1' and p.is_draft = '1'
    group by p.id, pi2.id`);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'VIEW',
                'public',
                'product_submissions_view',
                "select \tp.id, \n            coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, \n            pi2.key as thumbnail_key,\n            pi2.bucket as thumbnail_bucket,\n            pi2.region as thumbnail_region,\n            p.create_at,\n            case when COUNT(CASE WHEN m.is_approved THEN null else 1 END) > 0 then 1 else 0 end as requires_approval\n    from public.product p\n    inner join listing l on l.\"productId\" = p.id\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    left join product_image pi2 on pi2.\"productId\" = p.id and pi2.order = 0\n    where p.deleted_date is null and pi2.deleted_date is null\n    and p.is_active = '1' and p.is_draft = '1'\n    group by p.id, pi2.id",
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_search_view" AS select  l.id,
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
        group by l.id, p.id, li.id`);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_search_view',
                "select  l.id,\n                p.id as \"productId\",\n                l.\"YOM\" || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, \n                l.\"cost\" as price,\n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n                setweight(to_tsvector(p.name), 'B') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n                as document \n        from listing l\n        inner join product p on l.\"productId\" = p.id and p.deleted_date is null\n        inner join listing_status ls on ls.id = l.\"listingStatusId\"\n        left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        where ls.name = 'Listed' \n        and p.is_active = '1' \n        and p.is_draft = '0'\n        group by l.id, p.id, li.id",
            ]);
        });
    }
}
exports.userViewTracking1643095402404 = userViewTracking1643095402404;
//# sourceMappingURL=1643095402404-userViewTracking.js.map