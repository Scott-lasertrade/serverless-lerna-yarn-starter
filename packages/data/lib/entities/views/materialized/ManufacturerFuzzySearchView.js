"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManufacturerFuzzySearchView = void 0;
const typeorm_1 = require("typeorm");
let ManufacturerFuzzySearchView = class ManufacturerFuzzySearchView {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ManufacturerFuzzySearchView.prototype, "word", void 0);
ManufacturerFuzzySearchView = __decorate([
    (0, typeorm_1.ViewEntity)({
        name: 'manufacturer_fuzzy_search_view',
        expression: `
        select word from ts_stat('
            select 	to_tsvector(''simple'', name) as document 
            from manufacturer m'
        )
    `,
        materialized: true,
    })
], ManufacturerFuzzySearchView);
exports.ManufacturerFuzzySearchView = ManufacturerFuzzySearchView;
//# sourceMappingURL=ManufacturerFuzzySearchView.js.map