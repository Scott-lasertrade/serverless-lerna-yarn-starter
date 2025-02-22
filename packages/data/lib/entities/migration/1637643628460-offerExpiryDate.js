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
exports.offerExpiryDate1637643628460 = void 0;
class offerExpiryDate1637643628460 {
    constructor() {
        this.name = 'offerExpiryDate1637643628460';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer" ADD "offer_expiry_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '"2021-11-23T05:00:30.006Z"'`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "offer_expiry_date"`);
        });
    }
}
exports.offerExpiryDate1637643628460 = offerExpiryDate1637643628460;
//# sourceMappingURL=1637643628460-offerExpiryDate.js.map