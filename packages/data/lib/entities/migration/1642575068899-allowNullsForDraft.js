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
exports.allowNullsForDraft1642575068899 = void 0;
class allowNullsForDraft1642575068899 {
    constructor() {
        this.name = 'allowNullsForDraft1642575068899';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "dimension" ALTER COLUMN "weight" DROP NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "dimension" ALTER COLUMN "length" DROP NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "dimension" ALTER COLUMN "height" DROP NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "dimension" ALTER COLUMN "width" DROP NOT NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "dimension" ALTER COLUMN "width" SET NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "dimension" ALTER COLUMN "height" SET NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "dimension" ALTER COLUMN "length" SET NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "dimension" ALTER COLUMN "weight" SET NOT NULL`);
        });
    }
}
exports.allowNullsForDraft1642575068899 = allowNullsForDraft1642575068899;
