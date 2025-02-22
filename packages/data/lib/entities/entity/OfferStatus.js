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
exports.OfferStatus = void 0;
const typeorm_1 = require("typeorm");
const CommonEntity_1 = require("../utils/CommonEntity");
let OfferStatus = class OfferStatus extends CommonEntity_1.CommonEntity {
};
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
    }),
    __metadata("design:type", String)
], OfferStatus.prototype, "name", void 0);
OfferStatus = __decorate([
    (0, typeorm_1.Entity)('offer_status')
], OfferStatus);
exports.OfferStatus = OfferStatus;
//# sourceMappingURL=OfferStatus.js.map