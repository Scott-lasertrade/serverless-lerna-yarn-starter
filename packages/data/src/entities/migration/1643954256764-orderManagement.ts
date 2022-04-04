import { MigrationInterface, QueryRunner } from 'typeorm';

export class orderManagement1643954256764 implements MigrationInterface {
    name = 'orderManagement1643954256764';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['VIEW', 'public', 'offer_relation_view']
        );
        await queryRunner.query(`DROP VIEW "offer_relation_view"`);
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['MATERIALIZED_VIEW', 'public', 'live_listings_advanced_view']
        );
        await queryRunner.query(
            `DROP MATERIALIZED VIEW "live_listings_advanced_view"`
        );
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['VIEW', 'public', 'listing_seller_view']
        );
        await queryRunner.query(`DROP VIEW "listing_seller_view"`);
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_f4ac0e88f7210ad311200876fe6"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_fd223432bd1794fd83c49bd9ba9"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_2ef5d5742e52e2bca6d8798dda5"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" RENAME COLUMN "stock" TO "orderId"`
        );
        await queryRunner.query(
            `CREATE TABLE "order_line_item_type" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_f854ebb4462615f7ae5ab433354" UNIQUE ("name"), CONSTRAINT "PK_f9b6f095d9ada65a43e6fb6d9f9" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "order_line_item" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "title" character varying NOT NULL, "price" numeric(12,2), "typeId" integer, "orderId" integer, CONSTRAINT "PK_c4c5bcb010a01f13385ef7e8b49" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "order_status" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_96a7efa43bbc9ad9bc137016d8b" UNIQUE ("name"), CONSTRAINT "PK_8ea75b2a26f83f3bc98b9c6aaf6" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "order_buyer_details" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "business_name" character varying NOT NULL, "tax_id" character varying NOT NULL, "orderId" integer, "addressId" integer, CONSTRAINT "REL_9af73ac5dd782ecd33ccecb19f" UNIQUE ("orderId"), CONSTRAINT "REL_ee6f8afac63df5fe3cc595db85" UNIQUE ("addressId"), CONSTRAINT "PK_c789364abc753d93eb1b0366249" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "order" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "order_number" character varying, "total" numeric(12,2), "paid" numeric(12,2), "statusId" integer, "offerId" integer, "buyerId" integer, "sellerId" integer, CONSTRAINT "UQ_f9180f384353c621e8d0c414c14" UNIQUE ("order_number"), CONSTRAINT "REL_a536e1a65e8d9bf3f5a4cddc3e" UNIQUE ("offerId"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "listingId"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "buyerId"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "offerId"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "orderId" integer`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "stripe_pi_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "stripe_pi_id" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "stripe_payment_status"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "stripe_payment_status" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" ALTER COLUMN "orderId" DROP NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" ALTER COLUMN "orderId" DROP DEFAULT`
        );
        await queryRunner.query(`UPDATE "listing" SET "orderId" = null`);
        await queryRunner.query(
            `ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23T05:00:30.006Z'`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_a6e45c89cfbe8d92840266fd30f" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item" ADD CONSTRAINT "FK_f9f166c886161461749b03c0f9e" FOREIGN KEY ("typeId") REFERENCES "order_line_item_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item" ADD CONSTRAINT "FK_a99e41141120b3f54c2e72ac474" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order_buyer_details" ADD CONSTRAINT "FK_9af73ac5dd782ecd33ccecb19f6" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order_buyer_details" ADD CONSTRAINT "FK_ee6f8afac63df5fe3cc595db853" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "FK_3b6667bfe775fa39753ca6af2dc" FOREIGN KEY ("statusId") REFERENCES "order_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "FK_a536e1a65e8d9bf3f5a4cddc3ee" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20" FOREIGN KEY ("sellerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" ADD CONSTRAINT "FK_7c95d2b42a5ad1905caac100bc1" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(`CREATE VIEW "listing_seller_view" AS 
        select  l.id as listing_id, 
                ls."name" as listing_status, 
                p.id as product_id, 
                coalesce(cast(l."YOM" as text), '') || ' ' || cast(coalesce((string_agg(m.name, ' ')), '') as text) || ' ' || p.name as product_name, 
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
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'VIEW',
                'public',
                'listing_seller_view',
                'select  l.id as listing_id, \n                ls."name" as listing_status, \n                p.id as product_id, \n                coalesce(cast(l."YOM" as text), \'\') || \' \' || cast(coalesce((string_agg(m.name, \' \')), \'\') as text) || \' \' || p.name as product_name, \n                lister.cognito_user_id as lister_id \n        from listing l\n        left join listing_status ls on ls.id = l."listingStatusId" \n        left join product p on l."productId" = p.id\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join account LA on l."accountId" = LA.id\n        left join account_to_user LTU on LTU.account = LA.id\n        left join public.user lister on LTU.user = lister.id\n        group by l.id, ls.name, p.id, l."YOM", p.name, lister.cognito_user_id',
            ]
        );
        await queryRunner.query(`CREATE VIEW "offer_relation_view" AS 
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
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'VIEW',
                'public',
                'offer_relation_view',
                'select  o.id as offer_id, \n                os.name as offer_status, \n                l.id as listing_id, \n                ls.name as listing_status, \n                p.id as product_id, \n                coalesce(cast(l."YOM" as text), \'\') || \' \' || coalesce((string_agg(m.name, \' \')), \'\') || \' \' || p.name as product_name, \n                buyer.cognito_user_id as buyer_id, \n                seller.cognito_user_id as seller_id \n        from offer o\n        left join offer_status os on o."statusId" = os.id \n        left join account BA on o."accountId" = BA.id\n        left join account_to_user BTU on BTU.account = BA.id\n        left join public.user buyer on BTU.user = buyer.id\n        left join listing l on o."listingId" = l.id\n        left join listing_status ls on ls.id = l."listingStatusId" \n        left join product p on l."productId" = p.id\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join account SA on l."accountId" = SA.id\n        left join account_to_user STU on STU.account = SA.id\n        left join public.user seller on STU.user = seller.id\n        group by o.id, os.name, l.id, ls.name, p.id, l."YOM", p.name, buyer.cognito_user_id, seller.cognito_user_id',
            ]
        );
        await queryRunner.query(`CREATE MATERIALIZED VIEW "live_listings_advanced_view" AS 
        select  l.id,
        p.id as "productId",
        l."YOM",
        p.name as "productName",
        m.name as "manufacturer",
        l."cost" as price,
        ls."name" as status,
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
    where ls.name in ('Listed', 'Sold') 
    and p.is_active = '1' 
    and p.is_draft = '0'
    group by l.id, p.id, li.id, ls.id, m.id, c.id
    `);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_advanced_view',
                "select  l.id,\n        p.id as \"productId\",\n        l.\"YOM\",\n        p.name as \"productName\",\n        m.name as \"manufacturer\",\n        l.\"cost\" as price,\n        ls.\"name\" as status,\n        l.create_at as created_on,\n        li.key as thumbnail_key,\n        li.bucket as thumbnail_bucket,\n        li.region as thumbnail_region,\n        c.id as category,\n        setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n        setweight(to_tsvector(p.name), 'B') || ' ' || \n        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n        as document\n    from listing l\n    inner join product p on l.\"productId\" = p.id and p.deleted_date is null\n    inner join listing_status ls on ls.id = l.\"listingStatusId\"\n    left join category_to_product ctp on ctp.product = p.id\n    left join category c on c.id = ctp.category\n    left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    where ls.name in ('Listed', 'Sold') \n    and p.is_active = '1' \n    and p.is_draft = '0'\n    group by l.id, p.id, li.id, ls.id, m.id, c.id",
            ]
        );
        await queryRunner.query(
            `
            INSERT INTO "order_line_item_type" (id, name) VALUES 
            (1, 'Shipping'),
            (2, 'Tax'),
            (3, 'Listing');
            `
        );
        await queryRunner.query(
            `
            INSERT INTO "order_status" (id, name) VALUES 
            (1, 'Generated'),
            (2, 'Details Provided'),
            (3, 'Deposit Made'),
            (4, 'Paid'),
            (5, 'Disputed'),
            (6, 'Refunded'),
            (7, 'Rejected');
            `
        );
        await queryRunner.query(
            `
            INSERT INTO "address_type" (id, name) VALUES 
            (3, 'Shipping');
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            DELETE FROM "address_type" WHERE name in 
            (
                'Shipping'
            );
            `
        );
        await queryRunner.query(
            `
            DELETE FROM "order_status" WHERE name in 
            (
                'Generated',
                'Details Provided',
                'Deposit Made',
                'Paid',
                'Disputed',
                'Refunded',
                'Rejected'
            );
            `
        );
        await queryRunner.query(
            `
            DELETE FROM "order_line_item_type" WHERE name in 
            (
                'Shipping',
                'Tax',
                'Listing'
            );
            `
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
            ['VIEW', 'public', 'offer_relation_view']
        );
        await queryRunner.query(`DROP VIEW "offer_relation_view"`);
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
            ['VIEW', 'public', 'listing_seller_view']
        );
        await queryRunner.query(`DROP VIEW "listing_seller_view"`);
        await queryRunner.query(
            `ALTER TABLE "listing" DROP CONSTRAINT "FK_7c95d2b42a5ad1905caac100bc1"`
        );
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20"`
        );
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`
        );
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "FK_a536e1a65e8d9bf3f5a4cddc3ee"`
        );
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "FK_3b6667bfe775fa39753ca6af2dc"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_buyer_details" DROP CONSTRAINT "FK_ee6f8afac63df5fe3cc595db853"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_buyer_details" DROP CONSTRAINT "FK_9af73ac5dd782ecd33ccecb19f6"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item" DROP CONSTRAINT "FK_a99e41141120b3f54c2e72ac474"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item" DROP CONSTRAINT "FK_f9f166c886161461749b03c0f9e"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_a6e45c89cfbe8d92840266fd30f"`
        );
        await queryRunner.query(
            `ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" ALTER COLUMN "orderId" SET DEFAULT '1'`
        );
        await queryRunner.query(`UPDATE "listing" SET "orderId" = '1'`);
        await queryRunner.query(
            `ALTER TABLE "listing" ALTER COLUMN "orderId" SET NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "stripe_payment_status"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "stripe_payment_status" text NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "stripe_pi_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "stripe_pi_id" text NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "orderId"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "offerId" integer`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "buyerId" integer`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "listingId" integer`
        );
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "order_buyer_details"`);
        await queryRunner.query(`DROP TABLE "order_status"`);
        await queryRunner.query(`DROP TABLE "order_line_item"`);
        await queryRunner.query(`DROP TABLE "order_line_item_type"`);
        await queryRunner.query(
            `ALTER TABLE "listing" RENAME COLUMN "orderId" TO "stock"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_2ef5d5742e52e2bca6d8798dda5" FOREIGN KEY ("buyerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_fd223432bd1794fd83c49bd9ba9" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_f4ac0e88f7210ad311200876fe6" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(`CREATE VIEW "listing_seller_view" AS select  l.id as listing_id, 
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
        group by l.id, ls.name, p.id, l."YOM", p.name, lister.cognito_user_id`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'VIEW',
                'public',
                'listing_seller_view',
                'select  l.id as listing_id, \n                ls."name" as listing_status, \n                p.id as product_id, \n                coalesce(cast(l."YOM" as text), \'\') || \' \' || cast(coalesce((string_agg(m.name, \' \')), \'JOIN\') as text) || \' \' || p.name as product_name, \n                lister.cognito_user_id as lister_id \n        from listing l\n        left join listing_status ls on ls.id = l."listingStatusId" \n        left join product p on l."productId" = p.id\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join account LA on l."accountId" = LA.id\n        left join account_to_user LTU on LTU.account = LA.id\n        left join public.user lister on LTU.user = lister.id\n        group by l.id, ls.name, p.id, l."YOM", p.name, lister.cognito_user_id',
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
    group by l.id, p.id, li.id, m.id, c.id`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'MATERIALIZED_VIEW',
                'public',
                'live_listings_advanced_view',
                "select  l.id,\n        p.id as \"productId\",\n        l.\"YOM\",\n        p.name as \"productName\",\n        m.name as \"manufacturer\",\n        l.\"cost\" as price,\n        l.stock,\n        l.create_at as created_on,\n        li.key as thumbnail_key,\n        li.bucket as thumbnail_bucket,\n        li.region as thumbnail_region,\n        c.id as category,\n        setweight(to_tsvector(cast(l.\"YOM\" as text)), 'A') || ' ' ||\n        setweight(to_tsvector(p.name), 'B') || ' ' || \n        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') \n        as document\n    from listing l\n    inner join product p on l.\"productId\" = p.id and p.deleted_date is null\n    inner join listing_status ls on ls.id = l.\"listingStatusId\"\n    left join category_to_product ctp on ctp.product = p.id\n    left join category c on c.id = ctp.category\n    left join listing_image li on li.\"listingId\" = l.id and li.order = 0 and li.deleted_date is null\n    left join product_to_manufacturer ptm on ptm.product = p.id\n    left join manufacturer m on m.id = ptm.manufacturer \n    where ls.name = 'Listed' \n    and p.is_active = '1' \n    and p.is_draft = '0'\n    group by l.id, p.id, li.id, m.id, c.id",
            ]
        );
        await queryRunner.query(`CREATE VIEW "offer_relation_view" AS select  o.id as offer_id, 
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
        group by o.id, os.name, l.id, ls.name, p.id, l."YOM", p.name, buyer.cognito_user_id, seller.cognito_user_id`);
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
            [
                'VIEW',
                'public',
                'offer_relation_view',
                'select  o.id as offer_id, \n                os.name as offer_status, \n                l.id as listing_id, \n                ls.name as listing_status, \n                p.id as product_id, \n                coalesce(cast(l."YOM" as text), \'\') || \' \' || coalesce((string_agg(m.name, \' \')), \'\') || \' \' || p.name as product_name, \n                buyer.cognito_user_id as buyer_id, \n                seller.cognito_user_id as seller_id \n        from offer o\n        left join offer_status os on o."statusId" = os.id \n        left join account BA on o."accountId" = BA.id\n        left join account_to_user BTU on BTU.account = BA.id\n        left join public.user buyer on BTU.user = buyer.id\n        left join listing l on o."listingId" = l.id\n        left join listing_status ls on ls.id = l."listingStatusId" \n        left join product p on l."productId" = p.id\n        left join product_to_manufacturer ptm on ptm.product = p.id\n        left join manufacturer m on m.id = ptm.manufacturer \n        left join account SA on l."accountId" = SA.id\n        left join account_to_user STU on STU.account = SA.id\n        left join public.user seller on STU.user = seller.id\n        group by o.id, os.name, l.id, ls.name, p.id, l."YOM", p.name, buyer.cognito_user_id, seller.cognito_user_id',
            ]
        );
    }
}
