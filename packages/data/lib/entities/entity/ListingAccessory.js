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
exports.ListingAccessory = void 0;
const typeorm_1 = require("typeorm");
const Listing_1 = require("./Listing");
const Usage_1 = require("./Usage");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
const Product_1 = require("./Product");
let ListingAccessory = class ListingAccessory extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.listing_accessories, {
        nullable: true,
    }),
    __metadata("design:type", Product_1.Product)
], ListingAccessory.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Listing_1.Listing, (listing) => listing.listing_accessories, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Listing_1.Listing)
], ListingAccessory.prototype, "listing", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Usage_1.Usage, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Usage_1.Usage)
], ListingAccessory.prototype, "usage", void 0);
ListingAccessory = __decorate([
    (0, typeorm_1.Entity)('listing_accessory')
], ListingAccessory);
exports.ListingAccessory = ListingAccessory;
