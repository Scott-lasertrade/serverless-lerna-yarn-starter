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
exports.offerStatusNotVersioned1635987064328 = void 0;
class offerStatusNotVersioned1635987064328 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer_status" DROP COLUMN "version"`);
            yield queryRunner.query(`ALTER TABLE "offer_status" DROP COLUMN "deleted_date"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer_status" ADD "deleted_date" TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE "offer_status" ADD "version" integer NOT NULL`);
        });
    }
}
exports.offerStatusNotVersioned1635987064328 = offerStatusNotVersioned1635987064328;
