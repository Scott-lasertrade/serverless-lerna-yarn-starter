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
exports.setupTransaction1643853429452 = void 0;
class setupTransaction1643853429452 {
    constructor() {
        this.name = 'setupTransaction1643853429452';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "price"`);
            yield queryRunner.query(`ALTER TABLE "transaction" ADD "stripe_pi_id" text NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "transaction" ADD "stripe_payment_status" text NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "transaction" ADD "offerId" integer`);
            yield queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_f4ac0e88f7210ad311200876fe6" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_f4ac0e88f7210ad311200876fe6"`);
            yield queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "offerId"`);
            yield queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "stripe_payment_status"`);
            yield queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "stripe_pi_id"`);
            yield queryRunner.query(`ALTER TABLE "transaction" ADD "price" numeric(12,2)`);
        });
    }
}
exports.setupTransaction1643853429452 = setupTransaction1643853429452;
//# sourceMappingURL=1643853429452-setupTransaction.js.map