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
exports.Listing = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const Address_1 = require("./Address");
const Offer_1 = require("./Offer");
const CurrencyType_1 = require("./CurrencyType");
const ListingAccessory_1 = require("./ListingAccessory");
const ListingImage_1 = require("./ListingImage");
const Product_1 = require("./Product");
const Question_1 = require("./Question");
const Usage_1 = require("./Usage");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
const Watchlist_1 = require("./Watchlist");
const ListingStatus_1 = require("./ListingStatus");
const Order_1 = require("./Order");
const CartItem_1 = require("./CartItem");
let Listing = class Listing extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => CurrencyType_1.CurrencyType, (currencyType) => currencyType.listings, {
        nullable: true,
    }),
    __metadata("design:type", CurrencyType_1.CurrencyType)
], Listing.prototype, "currency_type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, (account) => account.listings, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Account_1.Account)
], Listing.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ListingStatus_1.ListingStatus, (listing_status) => listing_status.listings),
    __metadata("design:type", ListingStatus_1.ListingStatus)
], Listing.prototype, "listing_status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.listings, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Product_1.Product)
], Listing.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Address_1.Address),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Address_1.Address)
], Listing.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Usage_1.Usage, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Usage_1.Usage)
], Listing.prototype, "usage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Listing.prototype, "serial_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "YOM", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Listing.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "reject_below", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Listing.prototype, "accept_above", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Listing.prototype, "is_on_ground_floor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Listing.prototype, "is_there_steps", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Listing.prototype, "is_packaging_required", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ListingAccessory_1.ListingAccessory, (listing_accessory) => listing_accessory.listing, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Listing.prototype, "listing_accessories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ListingImage_1.ListingImage, (listingImage) => listingImage.listing, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Listing.prototype, "listing_images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Offer_1.Offer, (offer) => offer.listing, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Listing.prototype, "offers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Watchlist_1.Watchlist, (watchlist) => watchlist.listing, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Listing.prototype, "watchlists", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CartItem_1.CartItem, (cartItem) => cartItem.listing, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Listing.prototype, "cart_items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, (order) => order.listing, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Listing.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Question_1.Question, (question) => question.listing, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Listing.prototype, "questions", void 0);
Listing = __decorate([
    (0, typeorm_1.Entity)('listing')
], Listing);
exports.Listing = Listing;
