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
exports.removalOfAccessory1642651701492 = void 0;
class removalOfAccessory1642651701492 {
    constructor() {
        this.name = 'removalOfAccessory1642651701492';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "accessory" DROP CONSTRAINT "FK_ee91d3127a921077a68cc4dcc38"`);
            yield queryRunner.query(`ALTER TABLE "accessory" DROP CONSTRAINT "FK_524f3c65638480ed74db8112a7c"`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" DROP CONSTRAINT "FK_0e5241ed8b4c972ffd14008fbc0"`);
            yield queryRunner.query(`DROP TABLE "accessory"`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" RENAME COLUMN "accessoryId" TO "productId"`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23T05:00:30.006Z'`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" ADD CONSTRAINT "FK_1a025aaf5338de8683fcd270430" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "listing_accessory" DROP CONSTRAINT "FK_1a025aaf5338de8683fcd270430"`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" RENAME COLUMN "productId" TO "accessoryId"`);
            yield queryRunner.query(`CREATE TABLE "accessory" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "name" character varying(100) NOT NULL, "usageTypeId" integer, "productId" integer, CONSTRAINT "PK_e1ead99f958789eeebd86246d74" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "listing_accessory" ADD CONSTRAINT "FK_0e5241ed8b4c972ffd14008fbc0" FOREIGN KEY ("accessoryId") REFERENCES "accessory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "accessory" ADD CONSTRAINT "FK_524f3c65638480ed74db8112a7c" FOREIGN KEY ("usageTypeId") REFERENCES "usage_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "accessory" ADD CONSTRAINT "FK_ee91d3127a921077a68cc4dcc38" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
}
exports.removalOfAccessory1642651701492 = removalOfAccessory1642651701492;
