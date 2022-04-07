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
exports.ListingApprovalsView = void 0;
const typeorm_1 = require("typeorm");
let ListingApprovalsView = class ListingApprovalsView {
};
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], ListingApprovalsView.prototype, "id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], ListingApprovalsView.prototype, "account_id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ListingApprovalsView.prototype, "product_id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ListingApprovalsView.prototype, "product_name", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], ListingApprovalsView.prototype, "cost", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Boolean)
], ListingApprovalsView.prototype, "product_is_active", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Boolean)
], ListingApprovalsView.prototype, "product_is_draft", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], ListingApprovalsView.prototype, "product_version", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], ListingApprovalsView.prototype, "version", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ListingApprovalsView.prototype, "listing_status", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ListingApprovalsView.prototype, "title", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ListingApprovalsView.prototype, "thumbnail_key", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ListingApprovalsView.prototype, "thumbnail_bucket", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ListingApprovalsView.prototype, "thumbnail_region", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ListingApprovalsView.prototype, "submitted_by", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Date)
], ListingApprovalsView.prototype, "create_at", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ListingApprovalsView.prototype, "manufacturers", void 0);
ListingApprovalsView = __decorate([
    typeorm_1.ViewEntity({
        name: 'listings_approval_view',
        expression: `
        select 	l.id, 
                l.version as version,
                l.cost as cost,
                a.id as account_id,
                p.id as product_id,
                p.name as product_name,
                p.is_active as product_is_active,
                p.is_draft as product_is_draft,
                p.version as product_version,
                coalesce(cast(l."YOM" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title,
                coalesce(string_agg(cast(m.id as text), ',')) as manufacturers,
                li.key as thumbnail_key,
                li.bucket as thumbnail_bucket,
                li.region as thumbnail_region,
                ls.name as listing_status,
                a.business_name as submitted_by, 
                l.create_at
        from public.listing l
        inner join product p on l."productId" = p.id 
        inner join listing_status ls on ls.id = l."listingStatusId"
        inner join account a on l."accountId" = a.id 
        left join listing_image li on li."listingId" = l.id and li.order = 0
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on ptm.manufacturer = m.id
        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null
        group by l.id, p.id, li.id, a.id, ls.id
    `,
    })
], ListingApprovalsView);
exports.ListingApprovalsView = ListingApprovalsView;
//# sourceMappingURL=ListingApprovalsView.js.map