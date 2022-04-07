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
exports.UsageType = void 0;
const Product_1 = require("./Product");
const Usage_1 = require("./Usage");
const typeorm_1 = require("typeorm");
const CommonEntity_1 = require("../utils/CommonEntity");
let UsageType = class UsageType extends CommonEntity_1.CommonEntity {
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UsageType.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => Product_1.Product, (product) => product.usage_type),
    __metadata("design:type", Array)
], UsageType.prototype, "products", void 0);
__decorate([
    typeorm_1.OneToMany(() => Usage_1.Usage, (usage) => usage.usage_type),
    __metadata("design:type", Array)
], UsageType.prototype, "usages", void 0);
UsageType = __decorate([
    typeorm_1.Entity('usage_type')
], UsageType);
exports.UsageType = UsageType;
//# sourceMappingURL=UsageType.js.map