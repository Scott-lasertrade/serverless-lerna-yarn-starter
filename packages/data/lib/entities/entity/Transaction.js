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
exports.Transaction = void 0;
const typeorm_1 = require("typeorm");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
const Checkout_1 = require("./Checkout");
const Order_1 = require("./Order");
const TransactionType_1 = require("./TransactionType");
let Transaction = class Transaction extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => TransactionType_1.TransactionType, (transaction_type) => transaction_type.transactions, {
        cascade: true,
    }),
    __metadata("design:type", TransactionType_1.TransactionType)
], Transaction.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Order_1.Order, (order) => order.transactions, {
        cascade: true,
    }),
    __metadata("design:type", Order_1.Order)
], Transaction.prototype, "order", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Transaction.prototype, "stripe_pi_id", void 0);
__decorate([
    typeorm_1.OneToOne(() => Checkout_1.Checkout, (checkout) => checkout.transaction, {
        nullable: true,
    }),
    __metadata("design:type", Checkout_1.Checkout)
], Transaction.prototype, "checkout", void 0);
Transaction = __decorate([
    typeorm_1.Entity('transaction')
], Transaction);
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map