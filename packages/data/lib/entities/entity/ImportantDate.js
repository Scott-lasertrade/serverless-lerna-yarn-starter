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
exports.ImportantDate = void 0;
const typeorm_1 = require("typeorm");
let ImportantDate = class ImportantDate extends typeorm_1.BaseEntity {
    constructor(id) {
        super();
        if (id) {
            this.id = id;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ImportantDate.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ImportantDate.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], ImportantDate.prototype, "iteration", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], ImportantDate.prototype, "run_started", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], ImportantDate.prototype, "run_ended", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ImportantDate.prototype, "created_on", void 0);
ImportantDate = __decorate([
    typeorm_1.Entity('important_date'),
    typeorm_1.Unique(['name']),
    __metadata("design:paramtypes", [Number])
], ImportantDate);
exports.ImportantDate = ImportantDate;
//# sourceMappingURL=ImportantDate.js.map