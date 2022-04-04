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
exports.productToProduct1642482152901 = void 0;
class productToProduct1642482152901 {
    constructor() {
        this.name = 'productToProduct1642482152901';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "product_connections_product" ("product" integer NOT NULL, "accessory" integer NOT NULL, CONSTRAINT "PK_1807d8be182b462e44cbe3e0825" PRIMARY KEY ("product", "accessory"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_aa466a8381fe6f8bc6563b184b" ON "product_connections_product" ("product") `);
            yield queryRunner.query(`CREATE INDEX "IDX_5c459dce3ff0c1ad94decd7b24" ON "product_connections_product" ("accessory") `);
            yield queryRunner.query(`ALTER TABLE "product_connections_product" ADD CONSTRAINT "FK_aa466a8381fe6f8bc6563b184b6" FOREIGN KEY ("product") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "product_connections_product" ADD CONSTRAINT "FK_5c459dce3ff0c1ad94decd7b243" FOREIGN KEY ("accessory") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "product_connections_product" DROP CONSTRAINT "FK_5c459dce3ff0c1ad94decd7b243"`);
            yield queryRunner.query(`ALTER TABLE "product_connections_product" DROP CONSTRAINT "FK_aa466a8381fe6f8bc6563b184b6"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_5c459dce3ff0c1ad94decd7b24"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_aa466a8381fe6f8bc6563b184b"`);
            yield queryRunner.query(`DROP TABLE "product_connections_product"`);
        });
    }
}
exports.productToProduct1642482152901 = productToProduct1642482152901;
