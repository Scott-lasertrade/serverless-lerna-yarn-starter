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
exports.LineItemType = void 0;
const typeorm_1 = require("typeorm");
const CommonEntity_1 = require("../utils/CommonEntity");
const OrderLineItem_1 = require("./OrderLineItem");
let LineItemType = class LineItemType extends CommonEntity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LineItemType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderLineItem_1.LineItem, (lineItem) => lineItem.type),
    __metadata("design:type", Array)
], LineItemType.prototype, "line_items", void 0);
LineItemType = __decorate([
    (0, typeorm_1.Entity)('order_line_item_type'),
    (0, typeorm_1.Unique)(['name'])
], LineItemType);
exports.LineItemType = LineItemType;
//# sourceMappingURL=OrderLineItemType.js.map