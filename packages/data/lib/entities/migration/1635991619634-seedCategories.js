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
exports.seedCategories1635991619634 = void 0;
class seedCategories1635991619634 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            INSERT INTO "category" (id, name) VALUES
            (1, 'Medical'),
            (2, 'Dentistry');
            INSERT INTO "category_type" (id, name, "categoryId") VALUES
            (1, 'Laser', 1),
            (2, 'Tooth Care', 2);
            INSERT INTO "category_function" (id, name, "categoryTypeId") VALUES
            (1, 'Skin Analysis', 1),
            (2, 'Plague Removal', 2),
            (3, 'Alignment', 2);
            INSERT INTO "category_treatment" (id, name) VALUES
            (1, 'Skin Cancer'),
            (2, 'Deep Clean');
            INSERT INTO "category_treatment_to_function" (category_treatment, category_function) VALUES
            (1, 1),
            (2, 2);
            `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DELETE FROM "category_treatment_to_function" WHERE category_treatment in 
            (
                1, 
                2
            ) OR category_function in (
                1,
                2,
                3
            );
            DELETE FROM "category_treatment" WHERE name in 
            (
                'Skin Cancer', 
                'Deep Clean',
                'Teeth'
            );
            DELETE FROM "category_function" WHERE name in 
            (
                'Skin Analysis', 
                'Plague Removal',
                'Alignment'
            );
            DELETE FROM "category_type" WHERE name in 
            (
                'Laser', 
                'Surgical',
                'Tooth Care'
            );
            DELETE FROM "category" WHERE name in 
            (
                'Medical', 
                'Dentistry'
            );
            `);
        });
    }
}
exports.seedCategories1635991619634 = seedCategories1635991619634;
//# sourceMappingURL=1635991619634-seedCategories.js.map