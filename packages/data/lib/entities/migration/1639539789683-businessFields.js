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
exports.businessFields1639539789683 = void 0;
class businessFields1639539789683 {
    constructor() {
        this.name = 'businessFields1639539789683';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "account" ADD "account_type" character varying(32)`);
            yield queryRunner.query(`ALTER TABLE "account" ADD "business_phone_number" character varying(16)`);
            yield queryRunner.query(`ALTER TABLE "account" ADD "legal_name" character varying(128)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "account" DROP COLUMN "legal_name"`);
            yield queryRunner.query(`ALTER TABLE "account" DROP COLUMN "business_phone_number"`);
            yield queryRunner.query(`ALTER TABLE "account" DROP COLUMN "account_type"`);
        });
    }
}
exports.businessFields1639539789683 = businessFields1639539789683;
