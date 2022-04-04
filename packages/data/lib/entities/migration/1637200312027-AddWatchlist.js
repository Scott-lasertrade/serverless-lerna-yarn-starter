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
exports.AddWatchlist1637200312027 = void 0;
class AddWatchlist1637200312027 {
    constructor() {
        this.name = 'AddWatchlist1637200312027';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "watchlist" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "listingId" integer, "accountId" integer, CONSTRAINT "PK_0c8c0dbcc8d379117138e71ad5b" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "watchlist" ADD CONSTRAINT "FK_c2c3340657b1e34c6fe057ca4e7" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "watchlist" ADD CONSTRAINT "FK_2d9a75c6b15314c682c8a17d93a" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "watchlist" DROP CONSTRAINT "FK_2d9a75c6b15314c682c8a17d93a"`);
            yield queryRunner.query(`ALTER TABLE "watchlist" DROP CONSTRAINT "FK_c2c3340657b1e34c6fe057ca4e7"`);
            yield queryRunner.query(`DROP TABLE "watchlist"`);
        });
    }
}
exports.AddWatchlist1637200312027 = AddWatchlist1637200312027;
