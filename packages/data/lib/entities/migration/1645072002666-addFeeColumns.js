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
exports.addFeeColumns1645072002666 = void 0;
class addFeeColumns1645072002666 {
    constructor() {
        this.name = 'addFeeColumns1645072002666';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "order" ADD "fixed_fee" numeric(12,2) NOT NULL DEFAULT '0'`);
            yield queryRunner.query(`ALTER TABLE "order" ADD "variable_fee" numeric(3,0) NOT NULL DEFAULT '11'`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "order" DROP COLUMN "variable_fee"`);
            yield queryRunner.query(`ALTER TABLE "order" DROP COLUMN "fixed_fee"`);
        });
    }
}
exports.addFeeColumns1645072002666 = addFeeColumns1645072002666;
//# sourceMappingURL=1645072002666-addFeeColumns.js.map