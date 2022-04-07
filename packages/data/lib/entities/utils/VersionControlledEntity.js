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
exports.VersionControlledEntity = void 0;
const typeorm_1 = require("typeorm");
const CommonEntity_1 = require("./CommonEntity");
let VersionControlledEntity = class VersionControlledEntity extends CommonEntity_1.CommonEntity {
    constructor(id, version) {
        super(id);
        this.id = id;
        this.version = version;
    }
};
__decorate([
    typeorm_1.VersionColumn({ default: 1 }),
    __metadata("design:type", Number)
], VersionControlledEntity.prototype, "version", void 0);
__decorate([
    typeorm_1.DeleteDateColumn(),
    __metadata("design:type", Date)
], VersionControlledEntity.prototype, "deleted_date", void 0);
VersionControlledEntity = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Number, Number])
], VersionControlledEntity);
exports.VersionControlledEntity = VersionControlledEntity;
//# sourceMappingURL=VersionControlledEntity.js.map