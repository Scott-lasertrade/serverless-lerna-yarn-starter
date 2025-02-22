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
exports.VControlManufacturer1646795982730 = void 0;
class VControlManufacturer1646795982730 {
    constructor() {
        this.name = 'VControlManufacturer1646795982730';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['VIEW', 'public', 'listings_approval_view']);
            yield queryRunner.query(`DROP VIEW "listings_approval_view"`);
            yield queryRunner.query(`ALTER TABLE "manufacturer" ADD "version" integer NOT NULL DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "manufacturer" ADD "deleted_date" TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE "offer_history" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "usage" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "listing" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "order_line_item" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "watchlist" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "version" SET DEFAULT '1'`);
            yield queryRunner.query(`CREATE VIEW "listings_approval_view" AS 
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
                coalesce(string_agg(cast(m.id as text), ',')) as manufacturers,
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
        left join manufacturer m on ptm.manufacturer = m.id
        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null
        group by l.id, p.id, li.id, a.id, ls.id
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'VIEW',
                'public',
                'listings_approval_view',
                "select \tl.id, \n                l.version as version,\n                l.cost as cost,\n                a.id as account_id,\n                p.id as product_id,\n                p.name as product_name,\n                p.is_active as product_is_active,\n                p.is_draft as product_is_draft,\n                p.version as product_version,\n                coalesce(cast(l.\"YOM\" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title,\n                coalesce(string_agg(cast(m.id as text), ',')) as manufacturers,\n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                ls.name as listing_status,\n                a.business_name as submitted_by, \n                l.create_at\n        from public.listing l\n        inner join product p on l.\"productId\" = p.id \n        inner join listing_status ls on ls.id = l.\"listingStatusId\"\n        inner join account a on l.\"accountId\" = a.id \n        left join listing_image li on li.\"listingId\" = l.id and li.order = 0\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on ptm.manufacturer = m.id\n        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null\n        group by l.id, p.id, li.id, a.id, ls.id",
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['VIEW', 'public', 'listings_approval_view']);
            yield queryRunner.query(`DROP VIEW "listings_approval_view"`);
            yield queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "watchlist" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "order_line_item" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "listing" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "usage" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "offer_history" ALTER COLUMN "version" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "manufacturer" DROP COLUMN "deleted_date"`);
            yield queryRunner.query(`ALTER TABLE "manufacturer" DROP COLUMN "version"`);
            yield queryRunner.query(`CREATE VIEW "listings_approval_view" AS select 	l.id, 
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
        group by l.id, p.id, li.id, a.id, ls.id`);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'VIEW',
                'public',
                'listings_approval_view',
                'select \tl.id, \n                l.version as version,\n                l.cost as cost,\n                a.id as account_id,\n                p.id as product_id,\n                p.name as product_name,\n                p.is_active as product_is_active,\n                p.is_draft as product_is_draft,\n                p.version as product_version,\n                coalesce(cast(l."YOM" as text), \'\') || \' \' || coalesce((string_agg(m.name, \' \')), \'\') || \' \' || p.name as title, \n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                ls.name as listing_status,\n                a.business_name as submitted_by, \n                l.create_at\n        from public.listing l\n        inner join product p on l."productId" = p.id \n        inner join listing_status ls on ls.id = l."listingStatusId"\n        inner join account a on l."accountId" = a.id \n        left join listing_image li on li."listingId" = l.id and li.order = 0\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer\n        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null\n        group by l.id, p.id, li.id, a.id, ls.id',
            ]);
        });
    }
}
exports.VControlManufacturer1646795982730 = VControlManufacturer1646795982730;
//# sourceMappingURL=1646795982730-VControlManufacturer.js.map