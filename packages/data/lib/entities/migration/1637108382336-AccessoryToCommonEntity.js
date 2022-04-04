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
exports.AccessoryToCommonEntity1637108382336 = void 0;
class AccessoryToCommonEntity1637108382336 {
    constructor() {
        this.name = 'AccessoryToCommonEntity1637108382336';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "accessory" DROP COLUMN "version"`);
            yield queryRunner.query(`ALTER TABLE "accessory" DROP COLUMN "deleted_date"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "accessory" ADD "deleted_date" TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE "accessory" ADD "version" integer NOT NULL`);
        });
    }
}
exports.AccessoryToCommonEntity1637108382336 = AccessoryToCommonEntity1637108382336;
