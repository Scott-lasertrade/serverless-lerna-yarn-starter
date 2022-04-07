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
exports.seedOfferStatuses1635987248712 = void 0;
class seedOfferStatuses1635987248712 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            INSERT INTO "offer_status" (id, name) VALUES
            (1, 'Offer made'),
            (2, 'Seller countered offer'),
            (3, 'Buyer countered offer'),
            (4, 'Offer accepted'),
            (5, 'Offer declined'),
            (6, 'Offer expired');
            `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DELETE FROM "offer_status" WHERE name in 
            (
                'Offer made', 
                'Seller countered offer', 
                'Buyer countered offer', 
                'Offer accepted', 
                'Offer declined',
                'Offer expired'
            );
            `);
        });
    }
}
exports.seedOfferStatuses1635987248712 = seedOfferStatuses1635987248712;
//# sourceMappingURL=1635987248712-seedOfferStatuses.js.map