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
exports.listingStatusTable1638498841219 = void 0;
class listingStatusTable1638498841219 {
    constructor() {
        this.name = 'listingStatusTable1638498841219';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "listing" RENAME COLUMN "status" TO "listingStatusId"`);
            yield queryRunner.query(`ALTER TYPE "public"."listing_status_enum" RENAME TO "listing_listingstatusid_enum"`);
            yield queryRunner.query(`CREATE TABLE "listing_status" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(16) NOT NULL, CONSTRAINT "PK_0524b292b49efd99751063f6ebc" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "listingStatusId"`);
            yield queryRunner.query(`ALTER TABLE "listing" ADD "listingStatusId" integer`);
            yield queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_194d206b73555b22b80462b30c2" FOREIGN KEY ("listingStatusId") REFERENCES "listing_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`
            INSERT INTO "listing_status" (id, name) VALUES 
            (1, 'Draft'),
            (2, 'Submitted'),
            (3, 'Approved'),
            (4, 'Rejected'),
            (5, 'Suspended')
            `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_194d206b73555b22b80462b30c2"`);
            yield queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "listingStatusId"`);
            yield queryRunner.query(`ALTER TABLE "listing" ADD "listingStatusId" "public"."listing_listingstatusid_enum" DEFAULT 'Product'`);
            yield queryRunner.query(`DROP TABLE "listing_status"`);
            yield queryRunner.query(`ALTER TYPE "public"."listing_listingstatusid_enum" RENAME TO "listing_status_enum"`);
            yield queryRunner.query(`ALTER TABLE "listing" RENAME COLUMN "listingStatusId" TO "status"`);
            yield queryRunner.query(`
            DELETE FROM "listing_status" WHERE name in 
            (
                'Draft',
                'Submitted',
                'Approved',
                'Rejected',
                'Suspended'
            );
        `);
        });
    }
}
exports.listingStatusTable1638498841219 = listingStatusTable1638498841219;
