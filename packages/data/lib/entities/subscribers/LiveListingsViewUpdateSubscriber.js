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
exports.LiveListingsViewUpdateSubscriber = void 0;
const typeorm_1 = require("typeorm");
const Listing_1 = require("../entity/Listing");
let LiveListingsViewUpdateSubscriber = class LiveListingsViewUpdateSubscriber {
    listenTo() {
        return Listing_1.Listing;
    }
    afterUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            // S.Y - TODO: find an efficent way to only update when listing goes from/to live OR
            // Migrate to lambda timed event for updates
            // if (
            //     Number(event.entity?.YOM) &&
            //     event.entity?.YOM.toString().length === 4
            // ) {
            //     await event.manager
            //         .getRepository(LiveListingsSearchView)
            //         .query('REFRESH MATERIALIZED VIEW live_listings_search_view');
            //     await event.manager
            //         .getRepository(LiveListingsSearchView)
            //         .query('REFRESH MATERIALIZED VIEW live_listings_advanced_view');
            //     await event.manager
            //         .getRepository(LiveListingsFuzzySearchView)
            //         .query(
            //             'REFRESH MATERIALIZED VIEW live_listings_fuzzy_search_view'
            //         );
            // }
        });
    }
};
LiveListingsViewUpdateSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], LiveListingsViewUpdateSubscriber);
exports.LiveListingsViewUpdateSubscriber = LiveListingsViewUpdateSubscriber;
