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
exports.LiveListingsFuzzySearchView = void 0;
const typeorm_1 = require("typeorm");
let LiveListingsFuzzySearchView = class LiveListingsFuzzySearchView {
};
__decorate([
    typeorm_1.Column({ type: 'text' }),
    __metadata("design:type", String)
], LiveListingsFuzzySearchView.prototype, "word", void 0);
LiveListingsFuzzySearchView = __decorate([
    typeorm_1.ViewEntity({
        name: 'live_listings_fuzzy_search_view',
        expression: `
        select word from ts_stat(
            'select setweight(to_tsvector(cast(l."YOM" as text)), ''A'') || '' '' || setweight(to_tsvector(''simple'', p.name), ''B'') || '' '' || 
                setweight(to_tsvector(''simple'', coalesce((string_agg(m.name, '' '')), '''')), ''C'') 
                as document 
            from listing l
            inner join product p on l."productId" = p.id and p.deleted_date is null
            inner join listing_status ls on ls.id = l."listingStatusId" 
            left join product_to_manufacturer ptm on ptm.product = p.id
            left join manufacturer m on m.id = ptm.manufacturer 
            where ls.name = ''Listed'' 
            and p.is_active = ''1'' 
            and p.is_draft = ''0''
            group by l.id, p.id'
        )
    `,
        materialized: true,
    })
], LiveListingsFuzzySearchView);
exports.LiveListingsFuzzySearchView = LiveListingsFuzzySearchView;
//# sourceMappingURL=LiveListingsFuzzySearchView.js.map