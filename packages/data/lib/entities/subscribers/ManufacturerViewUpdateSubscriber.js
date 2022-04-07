"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManufacturerViewUpdateSubscriber = void 0;
const typeorm_1 = require("typeorm");
const Manufacturer_1 = require("../entity/Manufacturer");
const ManufacturerSearchView_1 = require("../views/materialized/ManufacturerSearchView");
const ManufacturerFuzzySearchView_1 = require("../views/materialized/ManufacturerFuzzySearchView");
const ProductSearchView_1 = require("../views/materialized/ProductSearchView");
const ProductFuzzySearchView_1 = require("../views/materialized/ProductFuzzySearchView");
const LiveListingsSearchView_1 = require("../views/materialized/LiveListingsSearchView");
const LiveListingsFuzzySearchView_1 = require("../views/materialized/LiveListingsFuzzySearchView");
let ManufacturerViewUpdateSubscriber = class ManufacturerViewUpdateSubscriber {
    listenTo() {
        return Manufacturer_1.Manufacturer;
    }
    afterInsert(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield event.manager
                .getRepository(ManufacturerSearchView_1.ManufacturerSearchView)
                .query('REFRESH MATERIALIZED VIEW manufacturer_search_view');
            yield event.manager
                .getRepository(ManufacturerFuzzySearchView_1.ManufacturerFuzzySearchView)
                .query('REFRESH MATERIALIZED VIEW manufacturer_fuzzy_search_view');
        });
    }
    afterUpdate(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield event.manager
                .getRepository(ManufacturerSearchView_1.ManufacturerSearchView)
                .query('REFRESH MATERIALIZED VIEW manufacturer_search_view');
            yield event.manager
                .getRepository(ManufacturerFuzzySearchView_1.ManufacturerFuzzySearchView)
                .query('REFRESH MATERIALIZED VIEW manufacturer_fuzzy_search_view');
            yield event.manager
                .getRepository(ProductSearchView_1.ProductSearchView)
                .query('REFRESH MATERIALIZED VIEW product_search_view');
            yield event.manager
                .getRepository(ProductFuzzySearchView_1.ProductFuzzySearchView)
                .query('REFRESH MATERIALIZED VIEW product_fuzzy_search_view');
            yield event.manager
                .getRepository(LiveListingsSearchView_1.LiveListingsSearchView)
                .query('REFRESH MATERIALIZED VIEW live_listings_search_view');
            yield event.manager
                .getRepository(LiveListingsSearchView_1.LiveListingsSearchView)
                .query('REFRESH MATERIALIZED VIEW live_listings_advanced_view');
            yield event.manager
                .getRepository(LiveListingsFuzzySearchView_1.LiveListingsFuzzySearchView)
                .query('REFRESH MATERIALIZED VIEW live_listings_fuzzy_search_view');
        });
    }
    afterRemove(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield event.manager
                .getRepository(ManufacturerSearchView_1.ManufacturerSearchView)
                .query('REFRESH MATERIALIZED VIEW manufacturer_search_view');
            yield event.manager
                .getRepository(ManufacturerFuzzySearchView_1.ManufacturerFuzzySearchView)
                .query('REFRESH MATERIALIZED VIEW manufacturer_fuzzy_search_view');
        });
    }
};
ManufacturerViewUpdateSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], ManufacturerViewUpdateSubscriber);
exports.ManufacturerViewUpdateSubscriber = ManufacturerViewUpdateSubscriber;
//# sourceMappingURL=ManufacturerViewUpdateSubscriber.js.map