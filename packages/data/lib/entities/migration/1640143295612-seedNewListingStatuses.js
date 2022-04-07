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
exports.seedNewListingStatuses1640143295612 = void 0;
class seedNewListingStatuses1640143295612 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            UPDATE "listing_status" SET name='Listed' WHERE name='Approved';
            `);
            yield queryRunner.query(`
            UPDATE "listing_status" SET name='Pending Review' WHERE name='Submitted';
            `);
            yield queryRunner.query(`
            INSERT INTO "listing_status" (id, name) VALUES 
            (7, 'Sold'), 
            (8, 'Pending Sale');
            `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM "listing_status" WHERE name in ('Sold', 'Pending Sale');`);
            yield queryRunner.query(`UPDATE "listing_status" SET name='Submitted' WHERE name='Pending Review';`);
            yield queryRunner.query(`UPDATE "listing_status" SET name='Approved' WHERE name='Listed';`);
        });
    }
}
exports.seedNewListingStatuses1640143295612 = seedNewListingStatuses1640143295612;
//# sourceMappingURL=1640143295612-seedNewListingStatuses.js.map