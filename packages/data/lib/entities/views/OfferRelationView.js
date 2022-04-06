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
exports.OfferRelationView = void 0;
const typeorm_1 = require("typeorm");
let OfferRelationView = class OfferRelationView {
};
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], OfferRelationView.prototype, "offer_id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], OfferRelationView.prototype, "offer_status", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], OfferRelationView.prototype, "listing_id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], OfferRelationView.prototype, "listing_status", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], OfferRelationView.prototype, "product_id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], OfferRelationView.prototype, "product_name", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], OfferRelationView.prototype, "buyer_id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], OfferRelationView.prototype, "seller_id", void 0);
OfferRelationView = __decorate([
    typeorm_1.ViewEntity({
        name: 'offer_relation_view',
        expression: `
        select  o.id as offer_id, 
                os.name as offer_status, 
                l.id as listing_id, 
                ls.name as listing_status, 
                p.id as product_id, 
                coalesce(cast(l."YOM" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as product_name, 
                buyer.cognito_user_id as buyer_id, 
                seller.cognito_user_id as seller_id 
        from offer o
        left join offer_status os on o."statusId" = os.id 
        left join account BA on o."accountId" = BA.id
        left join account_to_user BTU on BTU.account = BA.id
        left join public.user buyer on BTU.user = buyer.id
        left join listing l on o."listingId" = l.id
        left join listing_status ls on ls.id = l."listingStatusId" 
        left join product p on l."productId" = p.id
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join account SA on l."accountId" = SA.id
        left join account_to_user STU on STU.account = SA.id
        left join public.user seller on STU.user = seller.id
        group by o.id, os.name, l.id, ls.name, p.id, l."YOM", p.name, buyer.cognito_user_id, seller.cognito_user_id
    `,
    })
], OfferRelationView);
exports.OfferRelationView = OfferRelationView;
