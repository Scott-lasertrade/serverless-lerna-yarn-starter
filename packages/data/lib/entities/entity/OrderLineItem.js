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
exports.LineItem = void 0;
const typeorm_1 = require("typeorm");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
const OrderLineItemType_1 = require("./OrderLineItemType");
const Order_1 = require("./Order");
let LineItem = class LineItem extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LineItem.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], LineItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => OrderLineItemType_1.LineItemType, (type) => type.line_items),
    __metadata("design:type", OrderLineItemType_1.LineItemType)
], LineItem.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_1.Order, (order) => order.line_items),
    __metadata("design:type", Order_1.Order)
], LineItem.prototype, "order", void 0);
LineItem = __decorate([
    (0, typeorm_1.Entity)('order_line_item')
], LineItem);
exports.LineItem = LineItem;
//# sourceMappingURL=OrderLineItem.js.map