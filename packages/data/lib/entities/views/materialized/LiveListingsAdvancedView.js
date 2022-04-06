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
exports.LiveListingsAdvancedView = void 0;
const typeorm_1 = require("typeorm");
let LiveListingsAdvancedView = class LiveListingsAdvancedView {
};
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], LiveListingsAdvancedView.prototype, "id", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], LiveListingsAdvancedView.prototype, "productId", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], LiveListingsAdvancedView.prototype, "title", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], LiveListingsAdvancedView.prototype, "price", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], LiveListingsAdvancedView.prototype, "status", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], LiveListingsAdvancedView.prototype, "thumbnail_key", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], LiveListingsAdvancedView.prototype, "thumbnail_bucket", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], LiveListingsAdvancedView.prototype, "thumbnail_region", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", String)
], LiveListingsAdvancedView.prototype, "manufacturer", void 0);
__decorate([
    typeorm_1.ViewColumn(),
    __metadata("design:type", Number)
], LiveListingsAdvancedView.prototype, "category", void 0);
__decorate([
    typeorm_1.Column({ type: 'tsvector' }),
    __metadata("design:type", String)
], LiveListingsAdvancedView.prototype, "document", void 0);
LiveListingsAdvancedView = __decorate([
    typeorm_1.ViewEntity({
        name: 'live_listings_advanced_view',
        expression: `
        select  l.id,
        p.id as "productId",
        l."YOM",
        p.name as "productName",
        m.name as "manufacturer",
        l."cost" as price,
        ls."name" as status,
        l.create_at as created_on,
        li.key as thumbnail_key,
        li.bucket as thumbnail_bucket,
        li.region as thumbnail_region,
        c.id as category,
        setweight(to_tsvector(cast(l."YOM" as text)), 'A') || ' ' ||
        setweight(to_tsvector(p.name), 'B') || ' ' || 
        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') 
        as document
    from listing l
    inner join product p on l."productId" = p.id and p.deleted_date is null
    inner join listing_status ls on ls.id = l."listingStatusId"
    left join category_to_product ctp on ctp.product = p.id
    left join category c on c.id = ctp.category
    left join listing_image li on li."listingId" = l.id and li.order = 0 and li.deleted_date is null
    left join product_to_manufacturer ptm on ptm.product = p.id
    left join manufacturer m on m.id = ptm.manufacturer 
    where ls.name in ('Listed', 'Sold') 
    and p.is_active = '1' 
    and p.is_draft = '0'
    group by l.id, p.id, li.id, ls.id, m.id, c.id
    `,
        materialized: true,
    })
], LiveListingsAdvancedView);
exports.LiveListingsAdvancedView = LiveListingsAdvancedView;
