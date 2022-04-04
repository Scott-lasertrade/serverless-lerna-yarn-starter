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
exports.productType1642557844582 = void 0;
class productType1642557844582 {
    constructor() {
        this.name = 'productType1642557844582';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "product_type" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, CONSTRAINT "PK_e0843930fbb8854fe36ca39dae1" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`
            INSERT INTO "product_type" (id, name) VALUES 
            (1, 'Device'), 
            (2, 'Accessory');
            `);
            yield queryRunner.query(`ALTER TABLE "product" ADD "productTypeId" integer`);
            yield queryRunner.query(`update "product" SET "productTypeId" = 1`);
            yield queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98" FOREIGN KEY ("productTypeId") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98"`);
            yield queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productTypeId"`);
            yield queryRunner.query(`DROP TABLE "product_type"`);
        });
    }
}
exports.productType1642557844582 = productType1642557844582;
