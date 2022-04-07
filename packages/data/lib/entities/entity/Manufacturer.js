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
exports.Manufacturer = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
let Manufacturer = class Manufacturer extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Manufacturer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Manufacturer.prototype, "is_approved", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Product_1.Product, (product) => product.manufacturers),
    (0, typeorm_1.JoinTable)({
        name: 'product_to_manufacturer',
        joinColumn: {
            name: 'manufacturer',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'product',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Manufacturer.prototype, "products", void 0);
Manufacturer = __decorate([
    (0, typeorm_1.Entity)('manufacturer')
], Manufacturer);
exports.Manufacturer = Manufacturer;
//# sourceMappingURL=Manufacturer.js.map