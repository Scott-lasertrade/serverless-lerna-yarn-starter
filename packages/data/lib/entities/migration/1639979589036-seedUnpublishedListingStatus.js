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
exports.seedUnpublishedListingStatus1639979589036 = void 0;
class seedUnpublishedListingStatus1639979589036 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            INSERT INTO "listing_status" (id, name) VALUES 
            (6, 'Unpublished');
            `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DELETE FROM "listing_status" WHERE name in 
            (
                'Unpublished'
            );
        `);
        });
    }
}
exports.seedUnpublishedListingStatus1639979589036 = seedUnpublishedListingStatus1639979589036;
//# sourceMappingURL=1639979589036-seedUnpublishedListingStatus.js.map