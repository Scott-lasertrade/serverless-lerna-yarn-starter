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
exports.addUserLoginHistory1646188030891 = void 0;
class addUserLoginHistory1646188030891 {
    constructor() {
        this.name = 'addUserLoginHistory1646188030891';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "user_login_history" ("id" SERIAL NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer, CONSTRAINT "PK_cc6cb18451f716b40ed6cd898b1" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "user_login_history" ADD CONSTRAINT "FK_8cd045e34dacf6e82ac34e783b5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "user_login_history" DROP CONSTRAINT "FK_8cd045e34dacf6e82ac34e783b5"`);
            yield queryRunner.query(`DROP TABLE "user_login_history"`);
        });
    }
}
exports.addUserLoginHistory1646188030891 = addUserLoginHistory1646188030891;
//# sourceMappingURL=1646188030891-addUserLoginHistory.js.map