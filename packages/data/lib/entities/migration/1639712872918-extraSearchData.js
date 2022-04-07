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
exports.extraSearchData1639712872918 = void 0;
class extraSearchData1639712872918 {
    constructor() {
        this.name = 'extraSearchData1639712872918';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'manufacturer_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "manufacturer_search_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'product_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "product_search_view"`);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "product_search_view" AS 
        select 	p.id, 
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
                p.is_draft as is_draft,
                p.is_active as is_active,
                pi2.key as thumbnail_key,
                pi2.bucket as thumbnail_bucket,
                pi2.region as thumbnail_region,
                setweight(to_tsvector(p.name), 'A') || ' ' || 
                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'B') 
                as document 
        from public.product p
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
        where p.deleted_date is null and pi2.deleted_date is null
        group by p.id, pi2.id
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'product_search_view',
                "select \tp.id, \n                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, \n                p.is_draft as is_draft,\n                p.is_active as is_active,\n                pi2.key as thumbnail_key,\n                pi2.bucket as thumbnail_bucket,\n                pi2.region as thumbnail_region,\n                setweight(to_tsvector(p.name), 'A') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'B') \n                as document \n        from public.product p\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join product_image pi2 on pi2.\"productId\" = p.id and pi2.order = 0\n        where p.deleted_date is null and pi2.deleted_date is null\n        group by p.id, pi2.id",
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "manufacturer_search_view" AS 
        select 	m.id,
                name,
                m.is_approved,
                to_tsvector(name) as document
        from manufacturer m 
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'manufacturer_search_view',
                'select \tm.id,\n                name,\n                m.is_approved,\n                to_tsvector(name) as document\n        from manufacturer m',
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'manufacturer_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "manufacturer_search_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'product_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "product_search_view"`);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "product_search_view" AS select 	p.id, 
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
                p.is_draft as is_draft,
                pi2.key as thumbnail_key,
                pi2.bucket as thumbnail_bucket,
                pi2.region as thumbnail_region,
                setweight(to_tsvector(p.name), 'A') || ' ' || 
                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'B') 
                as document 
        from public.product p
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
        where p.deleted_date is null and pi2.deleted_date is null
        group by p.id, pi2.id`);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'product_search_view',
                "select \tp.id, \n                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, \n                p.is_draft as is_draft,\n                pi2.key as thumbnail_key,\n                pi2.bucket as thumbnail_bucket,\n                pi2.region as thumbnail_region,\n                setweight(to_tsvector(p.name), 'A') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'B') \n                as document \n        from public.product p\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join product_image pi2 on pi2.\"productId\" = p.id and pi2.order = 0\n        where p.deleted_date is null and pi2.deleted_date is null\n        group by p.id, pi2.id",
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "manufacturer_search_view" AS select 	m.id,
                name,
                to_tsvector(name) as document
        from manufacturer m`);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'manufacturer_search_view',
                'select \tm.id,\n                name,\n                to_tsvector(name) as document\n        from manufacturer m',
            ]);
        });
    }
}
exports.extraSearchData1639712872918 = extraSearchData1639712872918;
//# sourceMappingURL=1639712872918-extraSearchData.js.map