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
exports.seedManufacturers1635981577426 = void 0;
class seedManufacturers1635981577426 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            INSERT INTO "manufacturer" (id, name) VALUES 
            (1, '3D Aesthetics'),
            (2, 'Aesthetic Bureau'),
            (3, 'Allergan'),
            (4, 'Alma'),
            (5, 'BTL'),
            (6, 'Candela'),
            (7, 'Canfield'),
            (8, 'Clinical Pro'),
            (9, 'Cryomed'),
            (10, 'Cutera'),
            (11, 'Cynosure'),
            (12, 'Deka'),
            (13, 'Dermal Solutions'),
            (14, 'Dermapen'),
            (15, 'Endymed'),
            (16, 'Global Beauty Group'),
            (17, 'Healthtec'),
            (18, 'Karl Storz'),
            (19, 'Kernel Medical'),
            (20, 'Laseraid'),
            (21, 'Lumenis'),
            (22, 'Lutronic'),
            (23, 'Merz Aesthetics'),
            (24, 'Olympus'),
            (25, 'Omnilux'),
            (26, 'Quanta System'),
            (27, 'Solta Medical'),
            (28, 'Spectrum'),
            (29, 'Venus Concept'),
            (30, 'Zimmer');
            REFRESH MATERIALIZED VIEW manufacturer_search_view;
            REFRESH MATERIALIZED VIEW manufacturer_fuzzy_search_view;
            `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DELETE FROM "manufacturer" WHERE name in 
            (
                '3D Aesthetics',
                'Aesthetic Bureau',
                'Allergan',
                'Alma',
                'BTL',
                'Candela',
                'Canfield',
                'Clinical Pro',
                'Cryomed',
                'Cutera',
                'Cynosure',
                'Deka',
                'Dermal Solutions',
                'Dermapen',
                'Endymed',
                'Global Beauty Group',
                'Healthtec',
                'Karl Storz',
                'Kernel Medical',
                'Laseraid',
                'Lumenis',
                'Lutronic',
                'Merz Aesthetics',
                'Olympus',
                'Omnilux',
                'Quanta System',
                'Solta Medical',
                'Spectrum',
                'Venus Concept',
                'Zimmer'
            );
            REFRESH MATERIALIZED VIEW manufacturer_search_view;
            REFRESH MATERIALIZED VIEW manufacturer_fuzzy_search_view;
            `);
        });
    }
}
exports.seedManufacturers1635981577426 = seedManufacturers1635981577426;
//# sourceMappingURL=1635981577426-seedManufacturers.js.map