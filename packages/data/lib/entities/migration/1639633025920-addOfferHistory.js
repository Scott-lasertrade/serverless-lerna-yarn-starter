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
exports.addOfferHistory1639633025920 = void 0;
class addOfferHistory1639633025920 {
    constructor() {
        this.name = 'addOfferHistory1639633025920';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "offer_history" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "text" character varying NOT NULL, "type" integer, "date" TIMESTAMP NOT NULL, "offerId" integer, CONSTRAINT "PK_f37fc79f8b462f53fe1f64a9044" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "offer_history" ADD CONSTRAINT "FK_ba85ecc7789218b80c3c3925473" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer_history" DROP CONSTRAINT "FK_ba85ecc7789218b80c3c3925473"`);
            yield queryRunner.query(`DROP TABLE "offer_history"`);
        });
    }
}
exports.addOfferHistory1639633025920 = addOfferHistory1639633025920;
