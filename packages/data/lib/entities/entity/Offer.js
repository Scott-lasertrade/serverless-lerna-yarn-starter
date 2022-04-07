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
exports.Offer = void 0;
const typeorm_1 = require("typeorm");
const Listing_1 = require("./Listing");
const Account_1 = require("./Account");
const OfferStatus_1 = require("./OfferStatus");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
const OfferHistory_1 = require("./OfferHistory");
const Order_1 = require("./Order");
let Offer = class Offer extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Offer.prototype, "value", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Offer.prototype, "offers_towards_limit", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Listing_1.Listing, (listing) => listing.offers, {
        nullable: true,
    }),
    __metadata("design:type", Listing_1.Listing)
], Offer.prototype, "listing", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Account_1.Account, (account) => account.offers, {
        nullable: true,
    }),
    __metadata("design:type", Account_1.Account)
], Offer.prototype, "account", void 0);
__decorate([
    typeorm_1.ManyToOne(() => OfferStatus_1.OfferStatus, {
        cascade: true,
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", OfferStatus_1.OfferStatus)
], Offer.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamptz', default: '2021-11-23T05:00:30.006Z' }),
    __metadata("design:type", Date)
], Offer.prototype, "offer_expiry_date", void 0);
__decorate([
    typeorm_1.OneToMany(() => OfferHistory_1.OfferHistory, (offer_history) => offer_history.offer, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Offer.prototype, "offer_history", void 0);
__decorate([
    typeorm_1.OneToOne(() => Order_1.Order, { nullable: true }),
    __metadata("design:type", Order_1.Order)
], Offer.prototype, "order", void 0);
Offer = __decorate([
    typeorm_1.Entity('offer')
], Offer);
exports.Offer = Offer;
//# sourceMappingURL=Offer.js.map