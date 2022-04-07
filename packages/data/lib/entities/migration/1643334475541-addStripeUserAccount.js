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
exports.addStripeUserAccount1643334475541 = void 0;
class addStripeUserAccount1643334475541 {
    constructor() {
        this.name = 'addStripeUserAccount1643334475541';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "account" ADD "stripe_user_id" character varying(128)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "account" DROP COLUMN "stripe_user_id"`);
        });
    }
}
exports.addStripeUserAccount1643334475541 = addStripeUserAccount1643334475541;
//# sourceMappingURL=1643334475541-addStripeUserAccount.js.map