import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAuditFields1646706321545 implements MigrationInterface {
    name = 'addAuditFields1646706321545';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "country" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "country" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "address_type" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "address_type" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "offer_status" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "offer_status" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "offer_history" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "offer_history" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "offer" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "offer" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "currency_type" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "currency_type" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "usage_type" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "usage_type" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "usage" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "usage" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "manufacturer" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "manufacturer" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "product_image" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "product_image" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "dimension" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "dimension" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "category" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "category" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "product_type" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "product_type" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "product" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "product" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_accessory" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_accessory" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_image" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_image" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "question" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "question" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_status" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_status" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "cart_item" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "cart_item" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction_type" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction_type" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item_type" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item_type" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order_status" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order_status" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "checkout" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "checkout" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order_buyer_details" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "order_buyer_details" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "address" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "address" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "watchlist" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "watchlist" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD "created_by" character varying NOT NULL DEFAULT 'TBD'`
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD "updated_by" character varying NOT NULL DEFAULT 'TBD'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "account" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "account" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchlist" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "watchlist" DROP COLUMN "created_by"`
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_by"`);
        await queryRunner.query(
            `ALTER TABLE "address" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "address" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_buyer_details" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_buyer_details" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "checkout" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "checkout" DROP COLUMN "created_by"`
        );
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "created_by"`);
        await queryRunner.query(
            `ALTER TABLE "order_history" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_history" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_status" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_status" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item_type" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "order_line_item_type" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction_type" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "transaction_type" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "cart_item" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "cart_item" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_status" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_status" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "question" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "question" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_image" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_image" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_accessory" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "listing_accessory" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "product" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "product" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_type" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_type" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "category" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "category" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "dimension" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "dimension" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_image" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_image" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "manufacturer" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "manufacturer" DROP COLUMN "created_by"`
        );
        await queryRunner.query(`ALTER TABLE "usage" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "usage" DROP COLUMN "created_by"`);
        await queryRunner.query(
            `ALTER TABLE "usage_type" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "usage_type" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "currency_type" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "currency_type" DROP COLUMN "created_by"`
        );
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "created_by"`);
        await queryRunner.query(
            `ALTER TABLE "offer_history" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "offer_history" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "offer_status" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "offer_status" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "address_type" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "address_type" DROP COLUMN "created_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "country" DROP COLUMN "updated_by"`
        );
        await queryRunner.query(
            `ALTER TABLE "country" DROP COLUMN "created_by"`
        );
    }
}
