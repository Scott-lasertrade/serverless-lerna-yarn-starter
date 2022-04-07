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
exports.addOrderHistory1646279464572 = void 0;
class addOrderHistory1646279464572 {
    constructor() {
        this.name = 'addOrderHistory1646279464572';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "order_history" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_number" character varying, "total" numeric(12,2), "paid" numeric(12,2), "deposit" numeric(12,2), "fixed_fee" numeric(12,2) NOT NULL DEFAULT '0', "variable_fee" numeric(3,0) NOT NULL DEFAULT '11', "orderId" integer, "listingId" integer, "statusId" integer, "buyerId" integer, "checkoutId" integer, CONSTRAINT "PK_cc71513680d03ecb01b96655b0c" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "order_history" ADD CONSTRAINT "FK_e15b4a73a3e53311433968993cc" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "order_history" ADD CONSTRAINT "FK_fb96ad01938c82e1906d26557e9" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "order_history" ADD CONSTRAINT "FK_af6f6c0eb6b049a4c22caf0a063" FOREIGN KEY ("statusId") REFERENCES "order_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "order_history" ADD CONSTRAINT "FK_5c00687b777198777aa70cf96a7" FOREIGN KEY ("buyerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "order_history" ADD CONSTRAINT "FK_a5652a83f508cf220f5053f0e51" FOREIGN KEY ("checkoutId") REFERENCES "checkout"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "order_history" DROP CONSTRAINT "FK_a5652a83f508cf220f5053f0e51"`);
            yield queryRunner.query(`ALTER TABLE "order_history" DROP CONSTRAINT "FK_5c00687b777198777aa70cf96a7"`);
            yield queryRunner.query(`ALTER TABLE "order_history" DROP CONSTRAINT "FK_af6f6c0eb6b049a4c22caf0a063"`);
            yield queryRunner.query(`ALTER TABLE "order_history" DROP CONSTRAINT "FK_fb96ad01938c82e1906d26557e9"`);
            yield queryRunner.query(`ALTER TABLE "order_history" DROP CONSTRAINT "FK_e15b4a73a3e53311433968993cc"`);
            yield queryRunner.query(`DROP TABLE "order_history"`);
        });
    }
}
exports.addOrderHistory1646279464572 = addOrderHistory1646279464572;
//# sourceMappingURL=1646279464572-addOrderHistory.js.map