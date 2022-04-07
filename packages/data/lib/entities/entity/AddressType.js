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
exports.AddressType = void 0;
const typeorm_1 = require("typeorm");
const CommonEntity_1 = require("../utils/CommonEntity");
const Address_1 = require("./Address");
let AddressType = class AddressType extends CommonEntity_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ length: 16 }),
    __metadata("design:type", String)
], AddressType.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => Address_1.Address, (address) => address.address_type),
    __metadata("design:type", Array)
], AddressType.prototype, "addresses", void 0);
AddressType = __decorate([
    typeorm_1.Entity('address_type')
], AddressType);
exports.AddressType = AddressType;
//# sourceMappingURL=AddressType.js.map