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
exports.alterImportantDates1645400075050 = void 0;
class alterImportantDates1645400075050 {
    constructor() {
        this.name = 'alterImportantDates1645400075050';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "important_date" DROP COLUMN "last_called"`);
            yield queryRunner.query(`ALTER TABLE "important_date" ADD "run_started" TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE "important_date" ADD "run_ended" TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE "important_date" ALTER COLUMN "iteration" SET DEFAULT '0'`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "important_date" ALTER COLUMN "iteration" DROP DEFAULT`);
            yield queryRunner.query(`ALTER TABLE "important_date" DROP COLUMN "run_ended"`);
            yield queryRunner.query(`ALTER TABLE "important_date" DROP COLUMN "run_started"`);
            yield queryRunner.query(`ALTER TABLE "important_date" ADD "last_called" TIMESTAMP NOT NULL DEFAULT now()`);
        });
    }
}
exports.alterImportantDates1645400075050 = alterImportantDates1645400075050;
//# sourceMappingURL=1645400075050-alterImportantDates.js.map