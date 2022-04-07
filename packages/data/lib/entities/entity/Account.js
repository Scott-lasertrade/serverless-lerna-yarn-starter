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
exports.Account = void 0;
const typeorm_1 = require("typeorm");
const Address_1 = require("./Address");
const Offer_1 = require("./Offer");
const Listing_1 = require("./Listing");
const Question_1 = require("./Question");
const User_1 = require("./User");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
const Order_1 = require("./Order");
const Watchlist_1 = require("./Watchlist");
const CartItem_1 = require("./CartItem");
let Account = class Account extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    typeorm_1.ManyToMany(() => User_1.User, (user) => user.accounts),
    __metadata("design:type", Array)
], Account.prototype, "users", void 0);
__decorate([
    typeorm_1.Column({ length: 32, nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "account_type", void 0);
__decorate([
    typeorm_1.Column({ length: 128, nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "stripe_user_id", void 0);
__decorate([
    typeorm_1.Column({ length: 128, nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "business_name", void 0);
__decorate([
    typeorm_1.Column({ length: 16, nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "business_phone_number", void 0);
__decorate([
    typeorm_1.Column({ length: 128, nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "legal_name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], Account.prototype, "is_status_approved", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "structure", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "tax_id", void 0);
__decorate([
    typeorm_1.Column({ length: 32, nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "category", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "hubspot_company_id", void 0);
__decorate([
    typeorm_1.OneToOne(() => Address_1.Address, (address) => address.account),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Address_1.Address)
], Account.prototype, "address", void 0);
__decorate([
    typeorm_1.OneToMany(() => Listing_1.Listing, (listing) => listing.account, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Account.prototype, "listings", void 0);
__decorate([
    typeorm_1.OneToMany(() => Offer_1.Offer, (offer) => offer.account, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Account.prototype, "offers", void 0);
__decorate([
    typeorm_1.OneToMany(() => Watchlist_1.Watchlist, (watchlist) => watchlist.account, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Account.prototype, "watchlists", void 0);
__decorate([
    typeorm_1.OneToMany(() => Order_1.Order, (order) => order.buyer),
    __metadata("design:type", Array)
], Account.prototype, "orders_bought", void 0);
__decorate([
    typeorm_1.OneToMany(() => Question_1.Question, (question) => question.asker, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Account.prototype, "questions", void 0);
__decorate([
    typeorm_1.OneToMany(() => CartItem_1.CartItem, (cartItem) => cartItem.account, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Account.prototype, "cart_items", void 0);
Account = __decorate([
    typeorm_1.Entity('account')
], Account);
exports.Account = Account;
//# sourceMappingURL=Account.js.map