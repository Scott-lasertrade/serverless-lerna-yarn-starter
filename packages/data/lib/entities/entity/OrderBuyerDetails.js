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
exports.OrderBuyerDetails = void 0;
const typeorm_1 = require("typeorm");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
const Address_1 = require("./Address");
const Checkout_1 = require("./Checkout");
let OrderBuyerDetails = class OrderBuyerDetails extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    (0, typeorm_1.OneToOne)(() => Checkout_1.Checkout, (order) => order.buyer_details),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Checkout_1.Checkout)
], OrderBuyerDetails.prototype, "checkout", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Address_1.Address),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Address_1.Address)
], OrderBuyerDetails.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderBuyerDetails.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderBuyerDetails.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderBuyerDetails.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderBuyerDetails.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderBuyerDetails.prototype, "business_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderBuyerDetails.prototype, "tax_id", void 0);
OrderBuyerDetails = __decorate([
    (0, typeorm_1.Entity)('order_buyer_details')
], OrderBuyerDetails);
exports.OrderBuyerDetails = OrderBuyerDetails;
