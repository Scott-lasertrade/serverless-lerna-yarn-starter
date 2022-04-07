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
exports.removeVersionFromOrder1644987114168 = void 0;
class removeVersionFromOrder1644987114168 {
    constructor() {
        this.name = 'removeVersionFromOrder1644987114168';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "order" DROP COLUMN "version"`);
            yield queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deleted_date"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "order" ADD "deleted_date" TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE "order" ADD "version" integer NOT NULL`);
        });
    }
}
exports.removeVersionFromOrder1644987114168 = removeVersionFromOrder1644987114168;
//# sourceMappingURL=1644987114168-removeVersionFromOrder.js.map