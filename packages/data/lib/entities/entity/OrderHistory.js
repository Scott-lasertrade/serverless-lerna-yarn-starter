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
exports.OrderHistory = void 0;
const typeorm_1 = require("typeorm");
const CommonEntity_1 = require("../utils/CommonEntity");
const Account_1 = require("./Account");
const Checkout_1 = require("./Checkout");
const Listing_1 = require("./Listing");
const Order_1 = require("./Order");
const OrderStatus_1 = require("./OrderStatus");
let OrderHistory = class OrderHistory extends CommonEntity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_1.Order, (order) => order.history, {
        nullable: true,
    }),
    __metadata("design:type", Order_1.Order)
], OrderHistory.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Listing_1.Listing, (listing) => listing.orders),
    __metadata("design:type", Listing_1.Listing)
], OrderHistory.prototype, "listing", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => OrderStatus_1.OrderStatus, (orderStatus) => orderStatus.orders),
    __metadata("design:type", OrderStatus_1.OrderStatus)
], OrderHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, (account) => account.orders_bought),
    __metadata("design:type", Account_1.Account)
], OrderHistory.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Checkout_1.Checkout, (checkout) => checkout.orders, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Checkout_1.Checkout)
], OrderHistory.prototype, "checkout", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrderHistory.prototype, "order_number", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], OrderHistory.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], OrderHistory.prototype, "paid", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], OrderHistory.prototype, "deposit", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderHistory.prototype, "fixed_fee", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 0, default: 11 }),
    __metadata("design:type", Number)
], OrderHistory.prototype, "variable_fee", void 0);
OrderHistory = __decorate([
    (0, typeorm_1.Entity)('order_history')
], OrderHistory);
exports.OrderHistory = OrderHistory;
