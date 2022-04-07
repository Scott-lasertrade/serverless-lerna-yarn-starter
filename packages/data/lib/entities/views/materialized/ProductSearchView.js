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
exports.ProductSearchView = void 0;
const typeorm_1 = require("typeorm");
let ProductSearchView = class ProductSearchView {
};
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], ProductSearchView.prototype, "id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ProductSearchView.prototype, "title", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Boolean)
], ProductSearchView.prototype, "is_draft", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Boolean)
], ProductSearchView.prototype, "is_active", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ProductSearchView.prototype, "thumbnail_key", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ProductSearchView.prototype, "thumbnail_bucket", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], ProductSearchView.prototype, "thumbnail_region", void 0);
__decorate([
    typeorm_1.Column({ type: 'tsvector' }),
    __metadata("design:type", String)
], ProductSearchView.prototype, "document", void 0);
ProductSearchView = __decorate([
    typeorm_1.ViewEntity({
        name: 'product_search_view',
        expression: `
        select 	p.id, 
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
                p.is_draft as is_draft,
                p.is_active as is_active,
                pi2.key as thumbnail_key,
                pi2.bucket as thumbnail_bucket,
                pi2.region as thumbnail_region,
                setweight(to_tsvector(p.name), 'A') || ' ' || 
                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'B') 
                as document 
        from public.product p
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
        where p.deleted_date is null and pi2.deleted_date is null
        group by p.id, pi2.id
    `,
        materialized: true,
    })
], ProductSearchView);
exports.ProductSearchView = ProductSearchView;
//# sourceMappingURL=ProductSearchView.js.map