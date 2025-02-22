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
exports.renameOffersTowardsLimit1636506339916 = void 0;
class renameOffersTowardsLimit1636506339916 {
    constructor() {
        this.name = 'renameOffersTowardsLimit1636506339916';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer" RENAME COLUMN "offersTowardsLimit" TO "offers_towards_limit"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer" RENAME COLUMN "offers_towards_limit" TO "offersTowardsLimit"`);
        });
    }
}
exports.renameOffersTowardsLimit1636506339916 = renameOffersTowardsLimit1636506339916;
//# sourceMappingURL=1636506339916-renameOffersTowardsLimit.js.map