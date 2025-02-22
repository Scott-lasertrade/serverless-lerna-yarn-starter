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
exports.OrderStatus = void 0;
const typeorm_1 = require("typeorm");
const CommonEntity_1 = require("../utils/CommonEntity");
const Order_1 = require("./Order");
let OrderStatus = class OrderStatus extends CommonEntity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, (order) => order.status),
    __metadata("design:type", Array)
], OrderStatus.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderStatus.prototype, "name", void 0);
OrderStatus = __decorate([
    (0, typeorm_1.Entity)('order_status'),
    (0, typeorm_1.Unique)(['name'])
], OrderStatus);
exports.OrderStatus = OrderStatus;
//# sourceMappingURL=OrderStatus.js.map