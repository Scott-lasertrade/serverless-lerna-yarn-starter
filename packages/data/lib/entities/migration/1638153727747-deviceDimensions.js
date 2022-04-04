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
exports.deviceDimensions1638153727747 = void 0;
class deviceDimensions1638153727747 {
    constructor() {
        this.name = 'deviceDimensions1638153727747';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'product_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "product_search_view"`);
            yield queryRunner.query(`CREATE TABLE "dimension" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "weight" numeric(12,2) NOT NULL, "length" integer NOT NULL, "height" integer NOT NULL, "width" integer NOT NULL, CONSTRAINT "PK_653e621826a32965348bd4faff4" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "product" ADD "dimensionsId" integer`);
            yield queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "UQ_6f6c0a5af3d82c09d813e08795b" UNIQUE ("dimensionsId")`);
            yield queryRunner.query(`ALTER TABLE "accessory" ADD "description" text`);
            yield queryRunner.query(`ALTER TABLE "accessory" ADD "dimensionsId" integer`);
            yield queryRunner.query(`ALTER TABLE "accessory" ADD CONSTRAINT "UQ_ba7d0e34bd3e2830524206c4cfd" UNIQUE ("dimensionsId")`);
            yield queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_6f6c0a5af3d82c09d813e08795b" FOREIGN KEY ("dimensionsId") REFERENCES "dimension"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "accessory" ADD CONSTRAINT "FK_ba7d0e34bd3e2830524206c4cfd" FOREIGN KEY ("dimensionsId") REFERENCES "dimension"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "product_search_view" AS 
        select 	p.id, 
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
                p.is_draft as is_draft,
                pi2.key as thumbnail_key,
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
                "select \tp.id, \n                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, \n                p.is_draft as is_draft,\n                pi2.key as thumbnail_key,\n                setweight(to_tsvector(p.name), 'A') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'B') \n                as document \n        from public.product p\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join product_image pi2 on pi2.\"productId\" = p.id and pi2.order = 0\n        where p.deleted_date is null and pi2.deleted_date is null\n        group by p.id, pi2.id",
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'product_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "product_search_view"`);
            yield queryRunner.query(`ALTER TABLE "accessory" DROP CONSTRAINT "FK_ba7d0e34bd3e2830524206c4cfd"`);
            yield queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_6f6c0a5af3d82c09d813e08795b"`);
            yield queryRunner.query(`ALTER TABLE "accessory" DROP CONSTRAINT "UQ_ba7d0e34bd3e2830524206c4cfd"`);
            yield queryRunner.query(`ALTER TABLE "accessory" DROP COLUMN "dimensionsId"`);
            yield queryRunner.query(`ALTER TABLE "accessory" DROP COLUMN "description"`);
            yield queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "UQ_6f6c0a5af3d82c09d813e08795b"`);
            yield queryRunner.query(`ALTER TABLE "product" DROP COLUMN "dimensionsId"`);
            yield queryRunner.query(`DROP TABLE "dimension"`);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "product_search_view" AS select 	p.id, 
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
                p.is_draft as is_draft,
                pi2.key as thumbnail_key,
                setweight(to_tsvector(p.name), 'A') || ' ' || 
                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'B') 
                as document 
        from public.product p
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
        where p.deleted_date is null and pi2.deleted_data is null
        group by p.id, pi2.id`);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'product_search_view',
                "select \tp.id, \n                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, \n                p.is_draft as is_draft,\n                pi2.key as thumbnail_key,\n                setweight(to_tsvector(p.name), 'A') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'B') \n                as document \n        from public.product p\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join product_image pi2 on pi2.\"productId\" = p.id and pi2.order = 0\n        where p.deleted_date is null and pi2.deleted_data is null\n        group by p.id, pi2.id",
            ]);
        });
    }
}
exports.deviceDimensions1638153727747 = deviceDimensions1638153727747;
