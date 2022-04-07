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
exports.ListingSellerView = void 0;
const typeorm_1 = require("typeorm");
let ListingSellerView = class ListingSellerView {
};
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], ListingSellerView.prototype, "listing_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], ListingSellerView.prototype, "listing_status", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], ListingSellerView.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], ListingSellerView.prototype, "product_name", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], ListingSellerView.prototype, "lister_id", void 0);
ListingSellerView = __decorate([
    (0, typeorm_1.ViewEntity)({
        name: 'listing_seller_view',
        expression: `
        select  l.id as listing_id, 
                ls."name" as listing_status, 
                p.id as product_id, 
                coalesce(cast(l."YOM" as text), '') || ' ' || cast(coalesce((string_agg(m.name, ' ')), '') as text) || ' ' || p.name as product_name, 
                lister.cognito_user_id as lister_id 
        from listing l
        left join listing_status ls on ls.id = l."listingStatusId" 
        left join product p on l."productId" = p.id
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join account LA on l."accountId" = LA.id
        left join account_to_user LTU on LTU.account = LA.id
        left join public.user lister on LTU.user = lister.id
        group by l.id, ls.name, p.id, l."YOM", p.name, lister.cognito_user_id
    `,
    })
], ListingSellerView);
exports.ListingSellerView = ListingSellerView;
//# sourceMappingURL=ListingSellerView.js.map