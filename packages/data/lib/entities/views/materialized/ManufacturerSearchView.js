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
exports.ManufacturerSearchView = void 0;
const typeorm_1 = require("typeorm");
let ManufacturerSearchView = class ManufacturerSearchView {
};
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], ManufacturerSearchView.prototype, "id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Boolean)
], ManufacturerSearchView.prototype, "is_approved", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ManufacturerSearchView.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'tsvector' }),
    __metadata("design:type", String)
], ManufacturerSearchView.prototype, "document", void 0);
ManufacturerSearchView = __decorate([
    typeorm_1.ViewEntity({
        name: 'manufacturer_search_view',
        expression: `
        select 	m.id,
                name,
                m.is_approved,
                to_tsvector(name) as document
        from manufacturer m 
    `,
        materialized: true,
    })
], ManufacturerSearchView);
exports.ManufacturerSearchView = ManufacturerSearchView;
