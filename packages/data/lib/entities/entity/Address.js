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
exports.Address = void 0;
const typeorm_1 = require("typeorm");
const Country_1 = require("./Country");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
const AddressType_1 = require("./AddressType");
const Account_1 = require("./Account");
const Listing_1 = require("./Listing");
const OrderBuyerDetails_1 = require("./OrderBuyerDetails");
let Address = class Address extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Country_1.Country, (country) => country.addresses, {
        nullable: true,
    }),
    __metadata("design:type", Country_1.Country)
], Address.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AddressType_1.AddressType, (address_type) => address_type.addresses),
    __metadata("design:type", AddressType_1.AddressType)
], Address.prototype, "address_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Address.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], Address.prototype, "post_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128 }),
    __metadata("design:type", String)
], Address.prototype, "address_line_1", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128 }),
    __metadata("design:type", String)
], Address.prototype, "address_line_2", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Address.prototype, "suburb", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Account_1.Account, (account) => account.address),
    __metadata("design:type", Account_1.Account)
], Address.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Listing_1.Listing, (listing) => listing.address),
    __metadata("design:type", Listing_1.Listing)
], Address.prototype, "listing", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => OrderBuyerDetails_1.OrderBuyerDetails, (order_buyer_details) => order_buyer_details.address),
    __metadata("design:type", OrderBuyerDetails_1.OrderBuyerDetails)
], Address.prototype, "order_buyer_details", void 0);
Address = __decorate([
    (0, typeorm_1.Entity)('address')
], Address);
exports.Address = Address;
