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
exports.addressToListing1638403967451 = void 0;
class addressToListing1638403967451 {
    constructor() {
        this.name = 'addressToListing1638403967451';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_b46b132f3f3f727522cf8eb40cc"`);
            yield queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "REL_b46b132f3f3f727522cf8eb40c"`);
            yield queryRunner.query(`ALTER TABLE "address" DROP COLUMN "accountId"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "address" ADD "accountId" integer`);
            yield queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "REL_b46b132f3f3f727522cf8eb40c" UNIQUE ("accountId")`);
            yield queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_b46b132f3f3f727522cf8eb40cc" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
}
exports.addressToListing1638403967451 = addressToListing1638403967451;
//# sourceMappingURL=1638403967451-addressToListing.js.map