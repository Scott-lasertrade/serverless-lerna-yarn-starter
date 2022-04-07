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
exports.seedTransactionTypes1644991906041 = void 0;
class seedTransactionTypes1644991906041 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            INSERT INTO "transaction_type" (id, name) VALUES
            (1, 'Security Deposit'),
            (2, 'Balance Payment')
            `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DELETE FROM "transaction_type" WHERE name in 
            (
                'Deposit Deposit', 
                'Balance Payment'
            );
            `);
        });
    }
}
exports.seedTransactionTypes1644991906041 = seedTransactionTypes1644991906041;
//# sourceMappingURL=1644991906041-seedTransactionTypes.js.map