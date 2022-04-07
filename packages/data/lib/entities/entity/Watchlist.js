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
exports.Watchlist = void 0;
const typeorm_1 = require("typeorm");
const Listing_1 = require("./Listing");
const Account_1 = require("./Account");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
let Watchlist = class Watchlist extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Listing_1.Listing, (listing) => listing.watchlists),
    __metadata("design:type", Listing_1.Listing)
], Watchlist.prototype, "listing", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, (account) => account.watchlists),
    __metadata("design:type", Account_1.Account)
], Watchlist.prototype, "account", void 0);
Watchlist = __decorate([
    (0, typeorm_1.Entity)('watchlist')
], Watchlist);
exports.Watchlist = Watchlist;
//# sourceMappingURL=Watchlist.js.map