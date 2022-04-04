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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const Listing_1 = require("./Listing");
const Transaction_1 = require("./Transaction");
const OrderLineItem_1 = require("./OrderLineItem");
const OrderStatus_1 = require("./OrderStatus");
const Account_1 = require("./Account");
const Checkout_1 = require("./Checkout");
const CommonEntity_1 = require("../utils/CommonEntity");
const OrderHistory_1 = require("./OrderHistory");
let Order = class Order extends CommonEntity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Listing_1.Listing, (listing) => listing.orders),
    __metadata("design:type", Listing_1.Listing)
], Order.prototype, "listing", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => OrderStatus_1.OrderStatus, (orderStatus) => orderStatus.orders),
    __metadata("design:type", OrderStatus_1.OrderStatus)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, (account) => account.orders_bought),
    __metadata("design:type", Account_1.Account)
], Order.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Checkout_1.Checkout, (checkout) => checkout.orders, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Checkout_1.Checkout)
], Order.prototype, "checkout", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "order_number", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "paid", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "deposit", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "fixed_fee", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 0, default: 11 }),
    __metadata("design:type", Number)
], Order.prototype, "variable_fee", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderLineItem_1.LineItem, (lineItem) => lineItem.order),
    __metadata("design:type", Array)
], Order.prototype, "line_items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Transaction_1.Transaction, (transaction) => transaction.order),
    __metadata("design:type", Array)
], Order.prototype, "transactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderHistory_1.OrderHistory, (order_history) => order_history.order),
    __metadata("design:type", Array)
], Order.prototype, "history", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)('order'),
    (0, typeorm_1.Unique)(['order_number'])
], Order);
exports.Order = Order;
