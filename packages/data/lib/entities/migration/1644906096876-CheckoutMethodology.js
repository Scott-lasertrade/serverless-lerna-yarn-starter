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
exports.CheckoutMethodology1644906096876 = void 0;
class CheckoutMethodology1644906096876 {
    constructor() {
        this.name = 'CheckoutMethodology1644906096876';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_7c95d2b42a5ad1905caac100bc1"`);
            yield queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20"`);
            yield queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_a536e1a65e8d9bf3f5a4cddc3ee"`);
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" DROP CONSTRAINT "FK_9af73ac5dd782ecd33ccecb19f6"`);
            yield queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "stripe_payment_status"`);
            yield queryRunner.query(`ALTER TABLE "transaction" ADD "typeId" integer`);
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" DROP COLUMN "orderId"`);
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" ADD "checkoutId" integer`);
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" ADD CONSTRAINT "UQ_1f4c121ba945223d8856cde61be" UNIQUE ("checkoutId")`);
            yield queryRunner.query(`CREATE TABLE "cart_item" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "shipping_estimate" numeric(12,2), "listingId" integer, "accountId" integer, CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "transaction_type" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "checkout" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "transactionId" integer, CONSTRAINT "REL_95093df69edbaaf5685ab67048" UNIQUE ("transactionId"), CONSTRAINT "PK_c3c52ebf395ba358759b1111ac1" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "orderId"`);
            yield queryRunner.query(`ALTER TABLE "order" DROP COLUMN "sellerId"`);
            yield queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "REL_a536e1a65e8d9bf3f5a4cddc3e"`);
            yield queryRunner.query(`ALTER TABLE "order" DROP COLUMN "offerId"`);
            yield queryRunner.query(`ALTER TABLE "order" ADD "listingId" integer`);
            yield queryRunner.query(`ALTER TABLE "order" ADD "checkoutId" integer`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23T05:00:30.006Z'`);
            yield queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_0e6461b9ef9024a318ab141bc6d" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_3ae16f2ce9954c1d507df4be73f" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_45f62a7f98171c11f05253040bb" FOREIGN KEY ("typeId") REFERENCES "transaction_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_3696f51d40889191dab4755f0fe" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_20d36da2063c0bf615c8d9f93e4" FOREIGN KEY ("checkoutId") REFERENCES "checkout"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "checkout" ADD CONSTRAINT "FK_95093df69edbaaf5685ab67048b" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" ADD CONSTRAINT "FK_1f4c121ba945223d8856cde61be" FOREIGN KEY ("checkoutId") REFERENCES "checkout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" DROP CONSTRAINT "FK_1f4c121ba945223d8856cde61be"`);
            yield queryRunner.query(`ALTER TABLE "checkout" DROP CONSTRAINT "FK_95093df69edbaaf5685ab67048b"`);
            yield queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_20d36da2063c0bf615c8d9f93e4"`);
            yield queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_3696f51d40889191dab4755f0fe"`);
            yield queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_45f62a7f98171c11f05253040bb"`);
            yield queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_3ae16f2ce9954c1d507df4be73f"`);
            yield queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_0e6461b9ef9024a318ab141bc6d"`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`);
            yield queryRunner.query(`ALTER TABLE "order" DROP COLUMN "checkoutId"`);
            yield queryRunner.query(`ALTER TABLE "order" DROP COLUMN "listingId"`);
            yield queryRunner.query(`ALTER TABLE "order" ADD "offerId" integer`);
            yield queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "REL_a536e1a65e8d9bf3f5a4cddc3e" UNIQUE ("offerId")`);
            yield queryRunner.query(`ALTER TABLE "order" ADD "sellerId" integer`);
            yield queryRunner.query(`ALTER TABLE "listing" ADD "orderId" integer`);
            yield queryRunner.query(`DROP TABLE "checkout"`);
            yield queryRunner.query(`DROP TABLE "transaction_type"`);
            yield queryRunner.query(`DROP TABLE "cart_item"`);
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" RENAME CONSTRAINT "UQ_1f4c121ba945223d8856cde61be" TO "REL_9af73ac5dd782ecd33ccecb19f"`);
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" RENAME COLUMN "checkoutId" TO "orderId"`);
            yield queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "typeId" TO "stripe_payment_status"`);
            yield queryRunner.query(`ALTER TABLE "order_buyer_details" ADD CONSTRAINT "FK_9af73ac5dd782ecd33ccecb19f6" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_a536e1a65e8d9bf3f5a4cddc3ee" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20" FOREIGN KEY ("sellerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_7c95d2b42a5ad1905caac100bc1" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
}
exports.CheckoutMethodology1644906096876 = CheckoutMethodology1644906096876;
