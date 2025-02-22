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
exports.CartItem = void 0;
const typeorm_1 = require("typeorm");
const CommonEntity_1 = require("../utils/CommonEntity");
const Account_1 = require("./Account");
const Listing_1 = require("./Listing");
let CartItem = class CartItem extends CommonEntity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Listing_1.Listing, (listing) => listing.cart_items),
    __metadata("design:type", Listing_1.Listing)
], CartItem.prototype, "listing", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, (account) => account.cart_items),
    __metadata("design:type", Account_1.Account)
], CartItem.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CartItem.prototype, "shipping_estimate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], CartItem.prototype, "listing_version", void 0);
CartItem = __decorate([
    (0, typeorm_1.Entity)('cart_item')
], CartItem);
exports.CartItem = CartItem;
//# sourceMappingURL=CartItem.js.map