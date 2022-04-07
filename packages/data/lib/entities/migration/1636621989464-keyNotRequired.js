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
exports.keyNotRequired1636621989464 = void 0;
class keyNotRequired1636621989464 {
    constructor() {
        this.name = 'keyNotRequired1636621989464';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "listing_image" ALTER COLUMN "key" DROP NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "product_image" ALTER COLUMN "key" DROP NOT NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "product_image" ALTER COLUMN "key" SET NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "listing_image" ALTER COLUMN "key" SET NOT NULL`);
        });
    }
}
exports.keyNotRequired1636621989464 = keyNotRequired1636621989464;
//# sourceMappingURL=1636621989464-keyNotRequired.js.map