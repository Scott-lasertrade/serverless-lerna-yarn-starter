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
exports.importantDates1644374118807 = void 0;
class importantDates1644374118807 {
    constructor() {
        this.name = 'importantDates1644374118807';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "important_date" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "iteration" integer NOT NULL, "last_called" TIMESTAMP NOT NULL DEFAULT now(), "created_on" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_51521da2c391da47ad7db1902df" UNIQUE ("name"), CONSTRAINT "PK_295e9252f2c4e9f40cebad7c44e" PRIMARY KEY ("id"))`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "offer_expiry_date" SET DEFAULT '2021-11-23 16:00:30.006+11'`);
        });
    }
}
exports.importantDates1644374118807 = importantDates1644374118807;
