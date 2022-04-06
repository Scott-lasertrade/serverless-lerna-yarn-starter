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
exports.Country = void 0;
const typeorm_1 = require("typeorm");
const CommonEntity_1 = require("../utils/CommonEntity");
const Address_1 = require("./Address");
let Country = class Country extends CommonEntity_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ length: 64 }),
    __metadata("design:type", String)
], Country.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ length: 3 }),
    __metadata("design:type", String)
], Country.prototype, "abbreviation", void 0);
__decorate([
    typeorm_1.OneToMany(() => Address_1.Address, (address) => address.country),
    __metadata("design:type", Array)
], Country.prototype, "addresses", void 0);
Country = __decorate([
    typeorm_1.Entity('country')
], Country);
exports.Country = Country;
