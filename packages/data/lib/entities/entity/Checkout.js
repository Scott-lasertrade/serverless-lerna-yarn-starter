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
exports.Checkout = void 0;
const typeorm_1 = require("typeorm");
const CommonEntity_1 = require("../utils/CommonEntity");
const Order_1 = require("./Order");
const OrderBuyerDetails_1 = require("./OrderBuyerDetails");
const Transaction_1 = require("./Transaction");
let Checkout = class Checkout extends CommonEntity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.OneToOne)(() => Transaction_1.Transaction, (transaction) => transaction.checkout),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Transaction_1.Transaction)
], Checkout.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => OrderBuyerDetails_1.OrderBuyerDetails, (orderBuyerDetails) => orderBuyerDetails.checkout),
    __metadata("design:type", OrderBuyerDetails_1.OrderBuyerDetails)
], Checkout.prototype, "buyer_details", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, (order) => order.checkout, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Checkout.prototype, "orders", void 0);
Checkout = __decorate([
    (0, typeorm_1.Entity)('checkout')
], Checkout);
exports.Checkout = Checkout;
