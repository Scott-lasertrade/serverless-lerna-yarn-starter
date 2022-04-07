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
var Product_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const Listing_1 = require("./Listing");
const Manufacturer_1 = require("./Manufacturer");
const ProductImage_1 = require("./ProductImage");
const UsageType_1 = require("./UsageType");
const Dimension_1 = require("./Dimension");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
const Category_1 = require("./Category");
const ProductType_1 = require("./ProductType");
const ListingAccessory_1 = require("./ListingAccessory");
let Product = Product_1 = class Product extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    typeorm_1.Column({
        length: 100,
    }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "specification", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "is_active", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "is_draft", void 0);
__decorate([
    typeorm_1.OneToOne(() => Dimension_1.Dimension, {
        nullable: true,
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Dimension_1.Dimension)
], Product.prototype, "dimensions", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UsageType_1.UsageType, (usageType) => usageType.products, {
        nullable: true,
    }),
    __metadata("design:type", UsageType_1.UsageType)
], Product.prototype, "usage_type", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ProductType_1.ProductType, (productType) => productType.products, {
        nullable: true,
    }),
    __metadata("design:type", ProductType_1.ProductType)
], Product.prototype, "product_type", void 0);
__decorate([
    typeorm_1.OneToMany(() => ProductImage_1.ProductImage, (productImage) => productImage.product, {
        nullable: true,
        cascade: true,
    }),
    __metadata("design:type", Array)
], Product.prototype, "product_images", void 0);
__decorate([
    typeorm_1.OneToMany(() => Listing_1.Listing, (listing) => listing.product, {
        nullable: true,
        cascade: true,
    }),
    __metadata("design:type", Array)
], Product.prototype, "listings", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Manufacturer_1.Manufacturer, (manufacturer) => manufacturer.products, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], Product.prototype, "manufacturers", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Category_1.Category, (category) => category.products, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], Product.prototype, "categories", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Product_1),
    typeorm_1.JoinTable({
        joinColumn: { name: 'product' },
        inverseJoinColumn: { name: 'accessory' },
    }),
    __metadata("design:type", Array)
], Product.prototype, "connections", void 0);
__decorate([
    typeorm_1.OneToMany(() => ListingAccessory_1.ListingAccessory, (listing_accessory) => listing_accessory.product, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Product.prototype, "listing_accessories", void 0);
Product = Product_1 = __decorate([
    typeorm_1.Entity('product')
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map