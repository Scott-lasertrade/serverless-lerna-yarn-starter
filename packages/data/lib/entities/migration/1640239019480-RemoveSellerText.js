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
exports.RemoveSellerText1640239019480 = void 0;
class RemoveSellerText1640239019480 {
    constructor() {
        this.name = 'RemoveSellerText1640239019480';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer_history" DROP COLUMN "text"`);
            yield queryRunner.query(`ALTER TABLE "offer_history" DROP COLUMN "seller_text"`);
            yield queryRunner.query(`ALTER TABLE "offer_history" ADD "info" character varying`);
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23T05:00:30.006Z'`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`);
            yield queryRunner.query(`ALTER TABLE "offer_history" DROP COLUMN "info"`);
            yield queryRunner.query(`ALTER TABLE "offer_history" ADD "seller_text" character varying NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "offer_history" ADD "text" character varying NOT NULL`);
        });
    }
}
exports.RemoveSellerText1640239019480 = RemoveSellerText1640239019480;
