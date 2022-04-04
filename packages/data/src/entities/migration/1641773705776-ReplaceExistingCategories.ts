import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceExistingCategories1641773705776
    implements MigrationInterface
{
    name = 'ReplaceExistingCategories1641773705776';

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
            ['MATERIALIZED_VIEW', 'public', 'category_look_up']
        );
        await queryRunner.query(`DROP MATERIALIZED VIEW "category_look_up"`);
        await queryRunner.query(
            `CREATE TABLE "category_to_product" ("category" integer NOT NULL, "product" integer NOT NULL, CONSTRAINT "PK_bdb9eee556e86845822077a43e6" PRIMARY KEY ("category", "product"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_e158661b3e511f835111760388" ON "category_to_product" ("category") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_39298d9ea92b786b515da6e2cf" ON "category_to_product" ("product") `
        );
        await queryRunner.query(
            `ALTER TABLE "category_function_to_accessory" DROP CONSTRAINT "FK_045819719c1b83e8d6f7605556a"`
        );
        await queryRunner.query(
            `ALTER TABLE "category_function_to_accessory" DROP CONSTRAINT "FK_4b98c619daba868cdb97ae1e5b4"`
        );
        await queryRunner.query(
            `ALTER TABLE "category_function_to_product" DROP CONSTRAINT "FK_ccd3bdffd2c3e78c5107025daad"`
        );
        await queryRunner.query(
            `ALTER TABLE "category_function_to_product" DROP CONSTRAINT "FK_b8aaa1c3fc7b46c77bba61f7b70"`
        );
        await queryRunner.query(
            `ALTER TABLE "category_treatment_to_function" DROP CONSTRAINT "FK_eebd266dd5b96c558dd6463bdf5"`
        );
        await queryRunner.query(
            `ALTER TABLE "category_treatment_to_function" DROP CONSTRAINT "FK_28f3920e8805725edfe3dfdecf7"`
        );
        await queryRunner.query(
            `ALTER TABLE "category_function" DROP CONSTRAINT "FK_791097305e2abb9df5210740939"`
        );
        await queryRunner.query(
            `ALTER TABLE "category_type" DROP CONSTRAINT "FK_cd20de06b928f1102b0ac2da794"`
        );
        await queryRunner.query(`DROP TABLE "category_function_to_accessory"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_ccd3bdffd2c3e78c5107025daa"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_b8aaa1c3fc7b46c77bba61f7b7"`
        );
        await queryRunner.query(`DROP TABLE "category_function_to_product"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_eebd266dd5b96c558dd6463bdf"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_28f3920e8805725edfe3dfdecf"`
        );
        await queryRunner.query(`DROP TABLE "category_treatment_to_function"`);
        await queryRunner.query(`DROP TABLE "category_treatment"`);
        await queryRunner.query(`DROP TABLE "category_function"`);
        await queryRunner.query(`DROP TABLE "category_type"`);
        await queryRunner.query(`DELETE FROM "category"`);
        await queryRunner.query(
            `ALTER TABLE "category" ADD "key" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "category" ADD CONSTRAINT "UQ_7c82c39b0dc8ef1ba334eb615a3" UNIQUE ("key")`
        );
        await queryRunner.query(
            `ALTER TABLE "category" ADD "parent_id" integer`
        );
        await queryRunner.query(
            `ALTER TABLE "category" ADD CONSTRAINT "FK_1117b4fcb3cd4abb4383e1c2743" FOREIGN KEY ("parent_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "category_to_product" ADD CONSTRAINT "FK_e158661b3e511f835111760388a" FOREIGN KEY ("category") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "category_to_product" ADD CONSTRAINT "FK_39298d9ea92b786b515da6e2cfc" FOREIGN KEY ("product") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `
            INSERT INTO category(id, key, name, parent_id) values('1', 'medical', 'Medical', null);
            INSERT INTO category(id, key, name, parent_id) values('2', 'medical|gastroenterology', 'Gastroenterology', '1');
            INSERT INTO category(id, key, name, parent_id) values('3', 'medical|gastroenterology|endoscopes', 'Endoscopes', '2');
            INSERT INTO category(id, key, name, parent_id) values('4', 'medical|gastroenterology|endoscopes_(flexible)', 'Endoscopes (Flexible)', '2');
            INSERT INTO category(id, key, name, parent_id) values('5', 'medical|gastroenterology|endoscopes_(rigid)', 'Endoscopes (Rigid)', '2');
            INSERT INTO category(id, key, name, parent_id) values('6', 'medical|drug_delivery', 'Drug Delivery', '1');
            INSERT INTO category(id, key, name, parent_id) values('7', 'medical|electrosurgery', 'Electrosurgery', '1');
            INSERT INTO category(id, key, name, parent_id) values('8', 'medical|obstetric', 'Obstetric', '1');
            INSERT INTO category(id, key, name, parent_id) values('9', 'medical|ultrasound', 'Ultrasound', '1');
            INSERT INTO category(id, key, name, parent_id) values('10', 'aesthetics', 'Aesthetics', null);
            INSERT INTO category(id, key, name, parent_id) values('11', 'aesthetics|laser', 'Laser', '10');
            INSERT INTO category(id, key, name, parent_id) values('12', 'aesthetics|laser|alexandrite', 'Alexandrite', '11');
            INSERT INTO category(id, key, name, parent_id) values('13', 'aesthetics|laser|nd:yag_long_pulse', 'Nd:yag Long Pulse', '11');
            INSERT INTO category(id, key, name, parent_id) values('14', 'aesthetics|laser|nd:yag_q-switched', 'Nd:yag Q-Switched', '11');
            INSERT INTO category(id, key, name, parent_id) values('15', 'aesthetics|laser|picosecond', 'Picosecond', '11');
            INSERT INTO category(id, key, name, parent_id) values('16', 'aesthetics|laser|diode', 'Diode', '11');
            INSERT INTO category(id, key, name, parent_id) values('17', 'aesthetics|laser|fractional', 'Fractional', '11');
            INSERT INTO category(id, key, name, parent_id) values('18', 'aesthetics|laser|co2', 'Co2', '11');`
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
        inner join product p on l."productId" = p.id 
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
                "select  l.id,\n                p.id as \"productId\",\n                l.\"YOM\" || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, \n                l.\"cost\" as price,\n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n                setweight(to_tsvector(p.name), 'B') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n                as document \n        from listing l\n        inner join product p on l.\"productId\" = p.id \n        inner join listing_status ls on ls.id = l.\"listingStatusId\"\n        left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        where ls.name = 'Listed' \n        and p.is_active = '1' \n        and p.is_draft = '0'\n        group by l.id, p.id, li.id",
            ]
        );
        await queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_advanced_view" AS 
        select  l.id,
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
    group by l.id, p.id, li.id, m.id, c.id
    `);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_advanced_view',
                "select  l.id,\n        p.id as \"productId\",\n        (select  l.\"YOM\" || ' ' || coalesce((string_agg(man.name, ' ')), '') from manufacturer man inner join product_to_manufacturer ptm2 on man.id = ptm2.manufacturer where ptm2.product = p.id group by ptm2.product) || ' ' || p.name as title,\n        l.\"cost\" as price,\n        li.key as thumbnail_key,\n        li.bucket as thumbnail_bucket,\n        li.region as thumbnail_region,\n        m.name as manufacturer,\n        c.id as category,\n        setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n        setweight(to_tsvector(p.name), 'B') || ' ' || \n        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n        as document \n    from listing l\n    inner join product p on l.\"productId\" = p.id \n    inner join listing_status ls on ls.id = l.\"listingStatusId\"\n    left join category_to_product ctp on ctp.product = p.id\n    left join category c on c.id = ctp.category\n    left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    where ls.name = 'Listed' \n    and p.is_active = '1' \n    and p.is_draft = '0'\n    group by l.id, p.id, li.id, m.id, c.id",
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
            `
            DELETE FROM category WHERE key in (
                'medical',
                'medical|gastroenterology',
                'medical|gastroenterology|endoscopes',
                'medical|gastroenterology|endoscopes_(flexible)',
                'medical|gastroenterology|endoscopes_(rigid)',
                'medical|drug_delivery',
                'medical|electrosurgery',
                'medical|obstetric',
                'medical|ultrasound',
                'aesthetics',
                'aesthetics|laser',
                'aesthetics|laser|alexandrite',
                'aesthetics|laser|nd:yag_long_pulse',
                'aesthetics|laser|nd:yag_q-switched',
                'aesthetics|laser|picosecond',
                'aesthetics|laser|diode',
                'aesthetics|laser|fractional',
                'aesthetics|laser|co2'
            );`
        );
        await queryRunner.query(
            `ALTER TABLE "category_to_product" DROP CONSTRAINT "FK_39298d9ea92b786b515da6e2cfc"`
        );
        await queryRunner.query(
            `ALTER TABLE "category_to_product" DROP CONSTRAINT "FK_e158661b3e511f835111760388a"`
        );
        await queryRunner.query(
            `ALTER TABLE "category" DROP CONSTRAINT "FK_1117b4fcb3cd4abb4383e1c2743"`
        );
        await queryRunner.query(
            `ALTER TABLE "category" DROP COLUMN "parent_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "category" DROP CONSTRAINT "UQ_7c82c39b0dc8ef1ba334eb615a3"`
        );
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "key"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_39298d9ea92b786b515da6e2cf"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_e158661b3e511f835111760388"`
        );
        await queryRunner.query(`DROP TABLE "category_to_product"`);
        await queryRunner.query(
            `CREATE TABLE "category_treatment" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_0ae804785ed8116cf938ff1c748" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "category_type" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "categoryId" integer, CONSTRAINT "PK_6c2bdfaadc414f95ca862fa5e0b" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "category_function" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "categoryTypeId" integer, CONSTRAINT "PK_b8108c522e4353db465f07d37e5" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "category_treatment_to_function" ("category_treatment" integer NOT NULL, "category_function" integer NOT NULL, CONSTRAINT "PK_ae116f118d3f1012b1333fc5820" PRIMARY KEY ("category_treatment", "category_function"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_28f3920e8805725edfe3dfdecf" ON "category_treatment_to_function" ("category_treatment") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_eebd266dd5b96c558dd6463bdf" ON "category_treatment_to_function" ("category_function") `
        );
        await queryRunner.query(
            `CREATE TABLE "category_function_to_product" ("category_function" integer NOT NULL, "product" integer NOT NULL, CONSTRAINT "PK_58d85a213bcdb7d3021bb0c91dc" PRIMARY KEY ("category_function", "product"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_b8aaa1c3fc7b46c77bba61f7b7" ON "category_function_to_product" ("category_function") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_ccd3bdffd2c3e78c5107025daa" ON "category_function_to_product" ("product") `
        );
        await queryRunner.query(
            `CREATE TABLE "category_function_to_accessory" ("category_function" integer NOT NULL, "accessory" integer NOT NULL, CONSTRAINT "PK_d88699f7242d7aa03e57595a84e" PRIMARY KEY ("category_function", "accessory"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_4b98c619daba868cdb97ae1e5b" ON "category_function_to_accessory" ("category_function") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_045819719c1b83e8d6f7605556" ON "category_function_to_accessory" ("accessory") `
        );
        await queryRunner.query(
            `ALTER TABLE "category_type" ADD CONSTRAINT "FK_cd20de06b928f1102b0ac2da794" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "category_function" ADD CONSTRAINT "FK_791097305e2abb9df5210740939" FOREIGN KEY ("categoryTypeId") REFERENCES "category_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "category_treatment_to_function" ADD CONSTRAINT "FK_28f3920e8805725edfe3dfdecf7" FOREIGN KEY ("category_treatment") REFERENCES "category_treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "category_treatment_to_function" ADD CONSTRAINT "FK_eebd266dd5b96c558dd6463bdf5" FOREIGN KEY ("category_function") REFERENCES "category_function"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "category_function_to_product" ADD CONSTRAINT "FK_b8aaa1c3fc7b46c77bba61f7b70" FOREIGN KEY ("category_function") REFERENCES "category_function"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "category_function_to_product" ADD CONSTRAINT "FK_ccd3bdffd2c3e78c5107025daad" FOREIGN KEY ("product") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "category_function_to_accessory" ADD CONSTRAINT "FK_4b98c619daba868cdb97ae1e5b4" FOREIGN KEY ("category_function") REFERENCES "category_function"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "category_function_to_accessory" ADD CONSTRAINT "FK_045819719c1b83e8d6f7605556a" FOREIGN KEY ("accessory") REFERENCES "accessory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `
            INSERT INTO "category" (id, name) VALUES
            (1, 'Medical'),
            (2, 'Dentistry');
            INSERT INTO "category_type" (id, name, "categoryId") VALUES
            (1, 'Laser', 1),
            (2, 'Tooth Care', 2);
            INSERT INTO "category_function" (id, name, "categoryTypeId") VALUES
            (1, 'Skin Analysis', 1),
            (2, 'Plague Removal', 2),
            (3, 'Alignment', 2);
            INSERT INTO "category_treatment" (id, name) VALUES
            (1, 'Skin Cancer'),
            (2, 'Deep Clean');
            INSERT INTO "category_treatment_to_function" (category_treatment, category_function) VALUES
            (1, 1),
            (2, 2);
            `
        );
        await queryRunner.query(`CREATE MATERIALIZED VIEW "category_look_up" AS select c.id as category_id, 0 as category_type_id, 0 as category_function_id, c.name as guid, 1 as depth from category c 
        union
        select c.id as category_id, ct.id as category_type_id, 0 as category_function_id, c.name || '|' || ct.name as guid, 2 as depth from category c 
        inner join category_type ct on c.id = ct."categoryId" 
        union
        select c.id as category_id, ct.id as category_type_id, cf.id as category_function_id, c.name || '|' || ct.name || '_' || cf.name as guid, 3 as depth from category c 
        inner join category_type ct on c.id = ct."categoryId" 
        inner join category_function cf on cf."categoryTypeId" = ct.id 
        order by depth`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'category_look_up',
                'select c.id as category_id, 0 as category_type_id, 0 as category_function_id, c.name as guid, 1 as depth from category c \n        union\n        select c.id as category_id, ct.id as category_type_id, 0 as category_function_id, c.name || \'|\' || ct.name as guid, 2 as depth from category c \n        inner join category_type ct on c.id = ct."categoryId" \n        union\n        select c.id as category_id, ct.id as category_type_id, cf.id as category_function_id, c.name || \'|\' || ct.name || \'_\' || cf.name as guid, 3 as depth from category c \n        inner join category_type ct on c.id = ct."categoryId" \n        inner join category_function cf on cf."categoryTypeId" = ct.id \n        order by depth',
            ]
        );
        await queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_advanced_view" AS select  l.id,
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
	group by l.id, p.id, li.id, m.id, c.id, ct.id, cf.id`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_advanced_view',
                "select  l.id,\n                p.id as \"productId\",\n                (select  l.\"YOM\" || ' ' || coalesce((string_agg(man.name, ' ')), '') from manufacturer man inner join product_to_manufacturer ptm2 on man.id = ptm2.manufacturer where ptm2.product = p.id group by ptm2.product) || ' ' || p.name as title,\n                l.\"cost\" as price,\n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                m.name as manufacturer,\n                c.id as category,\n                ct.id as \"categoryType\",\n                cf.id as \"categoryFunction\",\n                setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n                setweight(to_tsvector(p.name), 'B') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n                as document \n\tfrom listing l\n\tinner join product p on l.\"productId\" = p.id \n\tinner join listing_status ls on ls.id = l.\"listingStatusId\"\n\tleft join category_function_to_product cftp on cftp.product = p.id\n\tleft join category_function cf on cf.id = cftp.category_function \n\tleft join category_type ct on ct.id = cf.\"categoryTypeId\" \n\tleft join category c on c.id = ct.\"categoryId\" \n\tleft join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n\tleft join product_to_manufacturer ptm on ptm.product = p.id\n\tleft join manufacturer m on m.id = ptm.manufacturer \n\twhere ls.name = 'Listed' \n\tand p.is_active = '1' \n\tand p.is_draft = '0'\n\tgroup by l.id, p.id, li.id, m.id, c.id, ct.id, cf.id",
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
        group by l.id, p.id, li.id`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_search_view',
                "select  l.id,\n                p.id as \"productId\",\n                l.\"YOM\" || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, \n                l.\"cost\" as price,\n                li.key as thumbnail_key,\n                li.bucket as thumbnail_bucket,\n                li.region as thumbnail_region,\n                setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n                setweight(to_tsvector(p.name), 'B') || ' ' || \n                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n                as document \n        from listing l\n        inner join product p on l.\"productId\" = p.id \n        inner join listing_status ls on ls.id = l.\"listingStatusId\"\n        left join category_function_to_product cftp on cftp.product = p.id\n        left join category_function cf on cf.id = cftp.category_function \n        left join category_type ct on ct.id = cf.\"categoryTypeId\" \n        left join category c on c.id = ct.\"categoryId\" \n        left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        where ls.name = 'Listed' \n        and p.is_active = '1' \n        and p.is_draft = '0'\n        group by l.id, p.id, li.id",
            ]
        );
    }
}
