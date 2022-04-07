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
exports.TransactionTable1641450312848 = void 0;
class TransactionTable1641450312848 {
    constructor() {
        this.name = 'TransactionTable1641450312848';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "price" numeric(12,2), "listingId" integer, "buyerId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_fd223432bd1794fd83c49bd9ba9" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_2ef5d5742e52e2bca6d8798dda5" FOREIGN KEY ("buyerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_2ef5d5742e52e2bca6d8798dda5"`);
            yield queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_fd223432bd1794fd83c49bd9ba9"`);
            yield queryRunner.query(`DROP TABLE "transaction"`);
        });
    }
}
exports.TransactionTable1641450312848 = TransactionTable1641450312848;
//# sourceMappingURL=1641450312848-TransactionTable.js.map