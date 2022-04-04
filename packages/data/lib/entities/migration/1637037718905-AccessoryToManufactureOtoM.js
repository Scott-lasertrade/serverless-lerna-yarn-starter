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
exports.AccessoryToManufactureOtoM1637037718905 = void 0;
class AccessoryToManufactureOtoM1637037718905 {
    constructor() {
        this.name = 'AccessoryToManufactureOtoM1637037718905';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "accessory" ADD "manufacturerId" integer`);
            yield queryRunner.query(`ALTER TABLE "accessory" ADD CONSTRAINT "FK_6e2eb05a37ada37c29c662dad3e" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "accessory" DROP CONSTRAINT "FK_6e2eb05a37ada37c29c662dad3e"`);
            yield queryRunner.query(`ALTER TABLE "accessory" DROP COLUMN "manufacturerId"`);
        });
    }
}
exports.AccessoryToManufactureOtoM1637037718905 = AccessoryToManufactureOtoM1637037718905;
