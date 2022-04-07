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
exports.OfferHistoryStatus1641264702578 = void 0;
class OfferHistoryStatus1641264702578 {
    constructor() {
        this.name = 'OfferHistoryStatus1641264702578';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer_history" RENAME COLUMN "type" TO "statusId"`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23T05:00:30.006Z'`);
            yield queryRunner.query(`ALTER TABLE "offer_history" ADD CONSTRAINT "FK_b83314f8bdf43821026ba930bbf" FOREIGN KEY ("statusId") REFERENCES "offer_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer_history" DROP CONSTRAINT "FK_b83314f8bdf43821026ba930bbf"`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`);
            yield queryRunner.query(`ALTER TABLE "offer_history" RENAME COLUMN "statusId" TO "type"`);
        });
    }
}
exports.OfferHistoryStatus1641264702578 = OfferHistoryStatus1641264702578;
//# sourceMappingURL=1641264702578-OfferHistoryStatus.js.map