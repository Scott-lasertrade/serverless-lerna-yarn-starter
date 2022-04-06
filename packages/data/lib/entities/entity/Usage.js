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
exports.Usage = void 0;
const typeorm_1 = require("typeorm");
const UsageType_1 = require("./UsageType");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
let Usage = class Usage extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Usage.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UsageType_1.UsageType, (usageType) => usageType.usages, {
        nullable: true,
    }),
    __metadata("design:type", UsageType_1.UsageType)
], Usage.prototype, "usage_type", void 0);
Usage = __decorate([
    (0, typeorm_1.Entity)('usage')
], Usage);
exports.Usage = Usage;
