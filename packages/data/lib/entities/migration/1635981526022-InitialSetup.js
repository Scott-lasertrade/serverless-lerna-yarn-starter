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
exports.InitialSetup1635981526022 = void 0;
class InitialSetup1635981526022 {
    constructor() {
        this.name = 'InitialSetup1635981526022';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE typeorm_metadata (
                "type" varchar(255) NOT NULL,
                "database" varchar(255) DEFAULT NULL,
                "schema" varchar(255) DEFAULT NULL,
                "table" varchar(255) DEFAULT NULL,
                "name" varchar(255) DEFAULT NULL,
                "value" text
            )`);
            yield queryRunner.query(`CREATE TABLE "category_treatment" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_0ae804785ed8116cf938ff1c748" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "category_type" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "categoryId" integer, CONSTRAINT "PK_6c2bdfaadc414f95ca862fa5e0b" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "category_function" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "categoryTypeId" integer, CONSTRAINT "PK_b8108c522e4353db465f07d37e5" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "country" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(64) NOT NULL, "abbreviation" character varying(3) NOT NULL, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "address_type" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(16) NOT NULL, CONSTRAINT "PK_7e192deb7cdcfa2b478be7d664f" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "state" character varying(50) NOT NULL, "post_code" character varying(16) NOT NULL, "address_line_1" character varying(128) NOT NULL, "address_line_2" character varying(128) NOT NULL, "suburb" character varying(50) NOT NULL, "countryId" integer, "addressTypeId" integer, "accountId" integer, CONSTRAINT "REL_b46b132f3f3f727522cf8eb40c" UNIQUE ("accountId"), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "offer_status" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "name" character varying(100) NOT NULL, CONSTRAINT "PK_1af4df08e97fbc4569db6ca1ea4" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "offer" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "value" integer NOT NULL, "offersTowardsLimit" integer NOT NULL, "listingId" integer, "accountId" integer, "statusId" integer, CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "cognito_user_id" character varying NOT NULL, CONSTRAINT "UQ_ad92d96ba85bbf1b7f84acc238a" UNIQUE ("cognito_user_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "business_name" character varying(128), "is_status_approved" boolean, "structure" character varying, "registration_number" character varying, "category" character varying(32), "addressId" integer, CONSTRAINT "REL_d96017d82b031439613c39c1ec" UNIQUE ("addressId"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "currency_type" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(32) NOT NULL, "abbreviation" character varying(3) NOT NULL, "symbol" character varying(1) NOT NULL, CONSTRAINT "PK_a890ec72560063dacbfbbbdf4dc" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "usage_type" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_34c20f258f4248aae247099afac" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "usage" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "metric" character varying NOT NULL, "value" integer, "usageTypeId" integer, CONSTRAINT "PK_7bc33e71ab6c3b71eac72950b44" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "listing_accessory" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "accessoryId" integer, "usageId" integer, "listingId" integer, CONSTRAINT "REL_b349145bd9c485b70c858d7823" UNIQUE ("usageId"), CONSTRAINT "PK_c794de89b573c9237bdf703cd09" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "listing_image" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "bucket" character varying NOT NULL, "region" character varying NOT NULL, "key" character varying NOT NULL, "order" integer NOT NULL, "listingId" integer, CONSTRAINT "PK_5884ca1c2018515c1d738fd18e7" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TYPE "public"."listing_status_enum" AS ENUM('Draft', 'Done', 'Product', 'Photos', 'Shipping')`);
            yield queryRunner.query(`CREATE TABLE "listing" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "serial_number" character varying, "YOM" integer, "comment" text, "cost" numeric(12,2), "reject_below" numeric(12,2), "accept_above" numeric(12,2), "is_on_ground_floor" boolean, "is_there_steps" boolean, "is_packaging_required" boolean, "status" "public"."listing_status_enum" DEFAULT 'Product', "usageId" integer, "currencyTypeId" integer, "productId" integer, "addressId" integer, "accountId" integer, CONSTRAINT "REL_a03aef8a719efff453754daf2f" UNIQUE ("usageId"), CONSTRAINT "REL_483cba76a7945db3ed1f4f392d" UNIQUE ("addressId"), CONSTRAINT "PK_381d45ebb8692362c156d6b87d7" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "manufacturer" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_81fc5abca8ed2f6edc79b375eeb" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "product_image" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "bucket" character varying NOT NULL, "region" character varying NOT NULL, "key" character varying NOT NULL, "order" integer NOT NULL, "productId" integer, CONSTRAINT "PK_99d98a80f57857d51b5f63c8240" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "name" character varying(100) NOT NULL, "specification" text, "description" text, "is_active" boolean NOT NULL DEFAULT false, "is_draft" boolean NOT NULL DEFAULT false, "usageTypeId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "accessory" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "name" character varying(100) NOT NULL, "usageTypeId" integer, "productId" integer, CONSTRAINT "PK_e1ead99f958789eeebd86246d74" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "category_treatment_to_function" ("category_treatment" integer NOT NULL, "category_function" integer NOT NULL, CONSTRAINT "PK_ae116f118d3f1012b1333fc5820" PRIMARY KEY ("category_treatment", "category_function"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_28f3920e8805725edfe3dfdecf" ON "category_treatment_to_function" ("category_treatment") `);
            yield queryRunner.query(`CREATE INDEX "IDX_eebd266dd5b96c558dd6463bdf" ON "category_treatment_to_function" ("category_function") `);
            yield queryRunner.query(`CREATE TABLE "category_function_to_product" ("category_function" integer NOT NULL, "product" integer NOT NULL, CONSTRAINT "PK_58d85a213bcdb7d3021bb0c91dc" PRIMARY KEY ("category_function", "product"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_b8aaa1c3fc7b46c77bba61f7b7" ON "category_function_to_product" ("category_function") `);
            yield queryRunner.query(`CREATE INDEX "IDX_ccd3bdffd2c3e78c5107025daa" ON "category_function_to_product" ("product") `);
            yield queryRunner.query(`CREATE TABLE "category_function_to_accessory" ("category_function" integer NOT NULL, "accessory" integer NOT NULL, CONSTRAINT "PK_d88699f7242d7aa03e57595a84e" PRIMARY KEY ("category_function", "accessory"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_4b98c619daba868cdb97ae1e5b" ON "category_function_to_accessory" ("category_function") `);
            yield queryRunner.query(`CREATE INDEX "IDX_045819719c1b83e8d6f7605556" ON "category_function_to_accessory" ("accessory") `);
            yield queryRunner.query(`CREATE TABLE "account_to_user" ("user" integer NOT NULL, "account" integer NOT NULL, CONSTRAINT "PK_3978fa2497587e59dc5a6d8dee2" PRIMARY KEY ("user", "account"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_6d52cc47cafff3530bf0acfe7c" ON "account_to_user" ("user") `);
            yield queryRunner.query(`CREATE INDEX "IDX_90a4ae864cad7ed8f71d12cb03" ON "account_to_user" ("account") `);
            yield queryRunner.query(`CREATE TABLE "product_to_manufacturer" ("manufacturer" integer NOT NULL, "product" integer NOT NULL, CONSTRAINT "PK_308e557fa126e96448bf04c0130" PRIMARY KEY ("manufacturer", "product"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_3a3f971c3bc634059cf4bb1b13" ON "product_to_manufacturer" ("manufacturer") `);
            yield queryRunner.query(`CREATE INDEX "IDX_0d24fc4c9a8a1e6a2a8257ff40" ON "product_to_manufacturer" ("product") `);
            yield queryRunner.query(`ALTER TABLE "category_type" ADD CONSTRAINT "FK_cd20de06b928f1102b0ac2da794" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "category_function" ADD CONSTRAINT "FK_791097305e2abb9df5210740939" FOREIGN KEY ("categoryTypeId") REFERENCES "category_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d87215343c3a3a67e6a0b7f3ea9" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_c22c764ae32ba0ef10ab2ce8697" FOREIGN KEY ("addressTypeId") REFERENCES "address_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_b46b132f3f3f727522cf8eb40cc" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_dadbc0be2373193231f00156950" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_d09c379643b767efa904c4c62ca" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_5c51734e67bda8400c0b2bbf7b0" FOREIGN KEY ("statusId") REFERENCES "offer_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_d96017d82b031439613c39c1ecb" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "usage" ADD CONSTRAINT "FK_d43913e23172065f5f72714dca3" FOREIGN KEY ("usageTypeId") REFERENCES "usage_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" ADD CONSTRAINT "FK_0e5241ed8b4c972ffd14008fbc0" FOREIGN KEY ("accessoryId") REFERENCES "accessory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" ADD CONSTRAINT "FK_b349145bd9c485b70c858d7823f" FOREIGN KEY ("usageId") REFERENCES "usage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" ADD CONSTRAINT "FK_a368089281d1cde464194e232bd" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "listing_image" ADD CONSTRAINT "FK_b0d09774d741ddf347b214b95e0" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_a03aef8a719efff453754daf2f9" FOREIGN KEY ("usageId") REFERENCES "usage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_dbb1336190baa1467ceeee8f7a8" FOREIGN KEY ("currencyTypeId") REFERENCES "currency_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_7770a3a5601a9f2bbb71908d14f" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_483cba76a7945db3ed1f4f392dc" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_44f04ea4eba6eec53da8f394a40" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_139c435f999a26585f495d9ca71" FOREIGN KEY ("usageTypeId") REFERENCES "usage_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "accessory" ADD CONSTRAINT "FK_524f3c65638480ed74db8112a7c" FOREIGN KEY ("usageTypeId") REFERENCES "usage_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "accessory" ADD CONSTRAINT "FK_ee91d3127a921077a68cc4dcc38" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "category_treatment_to_function" ADD CONSTRAINT "FK_28f3920e8805725edfe3dfdecf7" FOREIGN KEY ("category_treatment") REFERENCES "category_treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "category_treatment_to_function" ADD CONSTRAINT "FK_eebd266dd5b96c558dd6463bdf5" FOREIGN KEY ("category_function") REFERENCES "category_function"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "category_function_to_product" ADD CONSTRAINT "FK_b8aaa1c3fc7b46c77bba61f7b70" FOREIGN KEY ("category_function") REFERENCES "category_function"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "category_function_to_product" ADD CONSTRAINT "FK_ccd3bdffd2c3e78c5107025daad" FOREIGN KEY ("product") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "category_function_to_accessory" ADD CONSTRAINT "FK_4b98c619daba868cdb97ae1e5b4" FOREIGN KEY ("category_function") REFERENCES "category_function"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "category_function_to_accessory" ADD CONSTRAINT "FK_045819719c1b83e8d6f7605556a" FOREIGN KEY ("accessory") REFERENCES "accessory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "account_to_user" ADD CONSTRAINT "FK_6d52cc47cafff3530bf0acfe7c0" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "account_to_user" ADD CONSTRAINT "FK_90a4ae864cad7ed8f71d12cb03f" FOREIGN KEY ("account") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "product_to_manufacturer" ADD CONSTRAINT "FK_3a3f971c3bc634059cf4bb1b133" FOREIGN KEY ("manufacturer") REFERENCES "manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "product_to_manufacturer" ADD CONSTRAINT "FK_0d24fc4c9a8a1e6a2a8257ff405" FOREIGN KEY ("product") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        where p.deleted_date is null
        group by p.id, pi2.id
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'product_search_view',
                "select \tp.id, \n                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, \n                p.is_draft as is_draft,\n                pi2.key as thumbnail_key,\n                setweight(to_tsvector(p.name), 'A') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'B') \n                as document \n        from public.product p\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join product_image pi2 on pi2.\"productId\" = p.id and pi2.order = 0\n        where p.deleted_date is null\n        group by p.id, pi2.id",
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "product_fuzzy_search_view" AS 
        select word from ts_stat(
            'select setweight(to_tsvector(''simple'', p.name), ''A'') || '' '' || 
                    setweight(to_tsvector(''simple'', coalesce((string_agg(m.name, '' '')), '''')), ''B'') 
                    as document 
            from public.product p
            left join product_to_manufacturer ptm on ptm.product = p.id
            left join manufacturer m on m.id = ptm.manufacturer 
            where p.deleted_date is null
            group by p.id'
        )
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'product_fuzzy_search_view',
                "select word from ts_stat(\n            'select setweight(to_tsvector(''simple'', p.name), ''A'') || '' '' || \n                    setweight(to_tsvector(''simple'', coalesce((string_agg(m.name, '' '')), '''')), ''B'') \n                    as document \n            from public.product p\n            left join product_to_manufacturer ptm on ptm.product = p.id\n            left join manufacturer m on m.id = ptm.manufacturer \n            where p.deleted_date is null\n            group by p.id'\n        )",
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "manufacturer_fuzzy_search_view" AS 
        select word from ts_stat('
            select 	to_tsvector(''simple'', name) as document 
            from manufacturer m'
        )
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'manufacturer_fuzzy_search_view',
                "select word from ts_stat('\n            select \tto_tsvector(''simple'', name) as document \n            from manufacturer m'\n        )",
            ]);
            yield queryRunner.query(`CREATE MATERIALIZED VIEW "manufacturer_search_view" AS 
        select 	m.id,
                name,
                to_tsvector(name) as document
        from manufacturer m 
    `);
            yield queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, [
                'MATERIALIZED_VIEW',
                'public',
                'manufacturer_search_view',
                'select \tm.id,\n                name,\n                to_tsvector(name) as document\n        from manufacturer m',
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE typeorm_metadata`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'manufacturer_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "manufacturer_search_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'manufacturer_fuzzy_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "manufacturer_fuzzy_search_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'product_fuzzy_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "product_fuzzy_search_view"`);
            yield queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ['MATERIALIZED_VIEW', 'public', 'product_search_view']);
            yield queryRunner.query(`DROP MATERIALIZED VIEW "product_search_view"`);
            yield queryRunner.query(`ALTER TABLE "product_to_manufacturer" DROP CONSTRAINT "FK_0d24fc4c9a8a1e6a2a8257ff405"`);
            yield queryRunner.query(`ALTER TABLE "product_to_manufacturer" DROP CONSTRAINT "FK_3a3f971c3bc634059cf4bb1b133"`);
            yield queryRunner.query(`ALTER TABLE "account_to_user" DROP CONSTRAINT "FK_90a4ae864cad7ed8f71d12cb03f"`);
            yield queryRunner.query(`ALTER TABLE "account_to_user" DROP CONSTRAINT "FK_6d52cc47cafff3530bf0acfe7c0"`);
            yield queryRunner.query(`ALTER TABLE "category_function_to_accessory" DROP CONSTRAINT "FK_045819719c1b83e8d6f7605556a"`);
            yield queryRunner.query(`ALTER TABLE "category_function_to_accessory" DROP CONSTRAINT "FK_4b98c619daba868cdb97ae1e5b4"`);
            yield queryRunner.query(`ALTER TABLE "category_function_to_product" DROP CONSTRAINT "FK_ccd3bdffd2c3e78c5107025daad"`);
            yield queryRunner.query(`ALTER TABLE "category_function_to_product" DROP CONSTRAINT "FK_b8aaa1c3fc7b46c77bba61f7b70"`);
            yield queryRunner.query(`ALTER TABLE "category_treatment_to_function" DROP CONSTRAINT "FK_eebd266dd5b96c558dd6463bdf5"`);
            yield queryRunner.query(`ALTER TABLE "category_treatment_to_function" DROP CONSTRAINT "FK_28f3920e8805725edfe3dfdecf7"`);
            yield queryRunner.query(`ALTER TABLE "accessory" DROP CONSTRAINT "FK_ee91d3127a921077a68cc4dcc38"`);
            yield queryRunner.query(`ALTER TABLE "accessory" DROP CONSTRAINT "FK_524f3c65638480ed74db8112a7c"`);
            yield queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_139c435f999a26585f495d9ca71"`);
            yield queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2"`);
            yield queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_44f04ea4eba6eec53da8f394a40"`);
            yield queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_483cba76a7945db3ed1f4f392dc"`);
            yield queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_7770a3a5601a9f2bbb71908d14f"`);
            yield queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_dbb1336190baa1467ceeee8f7a8"`);
            yield queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_a03aef8a719efff453754daf2f9"`);
            yield queryRunner.query(`ALTER TABLE "listing_image" DROP CONSTRAINT "FK_b0d09774d741ddf347b214b95e0"`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" DROP CONSTRAINT "FK_a368089281d1cde464194e232bd"`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" DROP CONSTRAINT "FK_b349145bd9c485b70c858d7823f"`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" DROP CONSTRAINT "FK_0e5241ed8b4c972ffd14008fbc0"`);
            yield queryRunner.query(`ALTER TABLE "usage" DROP CONSTRAINT "FK_d43913e23172065f5f72714dca3"`);
            yield queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_d96017d82b031439613c39c1ecb"`);
            yield queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_5c51734e67bda8400c0b2bbf7b0"`);
            yield queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_d09c379643b767efa904c4c62ca"`);
            yield queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_dadbc0be2373193231f00156950"`);
            yield queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_b46b132f3f3f727522cf8eb40cc"`);
            yield queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_c22c764ae32ba0ef10ab2ce8697"`);
            yield queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d87215343c3a3a67e6a0b7f3ea9"`);
            yield queryRunner.query(`ALTER TABLE "category_function" DROP CONSTRAINT "FK_791097305e2abb9df5210740939"`);
            yield queryRunner.query(`ALTER TABLE "category_type" DROP CONSTRAINT "FK_cd20de06b928f1102b0ac2da794"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_0d24fc4c9a8a1e6a2a8257ff40"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_3a3f971c3bc634059cf4bb1b13"`);
            yield queryRunner.query(`DROP TABLE "product_to_manufacturer"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_90a4ae864cad7ed8f71d12cb03"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_6d52cc47cafff3530bf0acfe7c"`);
            yield queryRunner.query(`DROP TABLE "account_to_user"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_045819719c1b83e8d6f7605556"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_4b98c619daba868cdb97ae1e5b"`);
            yield queryRunner.query(`DROP TABLE "category_function_to_accessory"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_ccd3bdffd2c3e78c5107025daa"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_b8aaa1c3fc7b46c77bba61f7b7"`);
            yield queryRunner.query(`DROP TABLE "category_function_to_product"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_eebd266dd5b96c558dd6463bdf"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_28f3920e8805725edfe3dfdecf"`);
            yield queryRunner.query(`DROP TABLE "category_treatment_to_function"`);
            yield queryRunner.query(`DROP TABLE "accessory"`);
            yield queryRunner.query(`DROP TABLE "product"`);
            yield queryRunner.query(`DROP TABLE "product_image"`);
            yield queryRunner.query(`DROP TABLE "manufacturer"`);
            yield queryRunner.query(`DROP TABLE "listing"`);
            yield queryRunner.query(`DROP TYPE "public"."listing_status_enum"`);
            yield queryRunner.query(`DROP TABLE "listing_image"`);
            yield queryRunner.query(`DROP TABLE "listing_accessory"`);
            yield queryRunner.query(`DROP TABLE "usage"`);
            yield queryRunner.query(`DROP TABLE "usage_type"`);
            yield queryRunner.query(`DROP TABLE "currency_type"`);
            yield queryRunner.query(`DROP TABLE "account"`);
            yield queryRunner.query(`DROP TABLE "user"`);
            yield queryRunner.query(`DROP TABLE "offer"`);
            yield queryRunner.query(`DROP TABLE "offer_status"`);
            yield queryRunner.query(`DROP TABLE "address"`);
            yield queryRunner.query(`DROP TABLE "address_type"`);
            yield queryRunner.query(`DROP TABLE "country"`);
            yield queryRunner.query(`DROP TABLE "category_function"`);
            yield queryRunner.query(`DROP TABLE "category_type"`);
            yield queryRunner.query(`DROP TABLE "category"`);
            yield queryRunner.query(`DROP TABLE "category_treatment"`);
        });
    }
}
exports.InitialSetup1635981526022 = InitialSetup1635981526022;
