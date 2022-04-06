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
exports.ProductSubmissionsView = void 0;
const typeorm_1 = require("typeorm");
let ProductSubmissionsView = class ProductSubmissionsView {
};
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], ProductSubmissionsView.prototype, "id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ProductSubmissionsView.prototype, "title", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ProductSubmissionsView.prototype, "thumbnail_key", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ProductSubmissionsView.prototype, "thumbnail_bucket", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ProductSubmissionsView.prototype, "thumbnail_region", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Boolean)
], ProductSubmissionsView.prototype, "requires_approval", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Date)
], ProductSubmissionsView.prototype, "create_at", void 0);
ProductSubmissionsView = __decorate([
    typeorm_1.ViewEntity({
        name: 'product_submissions_view',
        expression: `
        select 	p.id, 
            coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
            pi2.key as thumbnail_key,
            pi2.bucket as thumbnail_bucket,
            pi2.region as thumbnail_region,
            p.create_at,
            case when COUNT(CASE WHEN m.is_approved THEN null else 1 END) > 0 then 1 else 0 end as requires_approval
    from public.product p
    left join product_to_manufacturer ptm on ptm.product = p.id
    left join manufacturer m on m.id = ptm.manufacturer 
    left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
    where p.id in (select "productId" from listing where "productId" = p.id) And p.deleted_date is null and pi2.deleted_date is null
    and p.is_active = '1' and p.is_draft = '1'
    group by p.id, pi2.id
    `,
    })
], ProductSubmissionsView);
exports.ProductSubmissionsView = ProductSubmissionsView;
