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
exports.ListingImage = void 0;
const typeorm_1 = require("typeorm");
const Listing_1 = require("./Listing");
const ImageEntity_1 = require("../utils/ImageEntity");
let ListingImage = class ListingImage extends ImageEntity_1.ImageEntity {
};
__decorate([
    typeorm_1.ManyToOne(() => Listing_1.Listing, (listing) => listing.listing_images, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Listing_1.Listing)
], ListingImage.prototype, "listing", void 0);
ListingImage = __decorate([
    typeorm_1.Entity('listing_image')
], ListingImage);
exports.ListingImage = ListingImage;
//# sourceMappingURL=ListingImage.js.map