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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const VersionControlledEntity_1 = require("../utils/VersionControlledEntity");
const UserLoginHistory_1 = require("./UserLoginHistory");
let User = class User extends VersionControlledEntity_1.VersionControlledEntity {
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "cognito_user_id", void 0);
__decorate([
    typeorm_1.Column({ default: 'Manually replace' }),
    __metadata("design:type", String)
], User.prototype, "hubspot_user_id", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "enabled", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Account_1.Account, (account) => account.users),
    typeorm_1.JoinTable({
        name: 'account_to_user',
        joinColumn: {
            name: 'user',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'account',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "accounts", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserLoginHistory_1.UserLoginHistory, (login_history) => login_history.user, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "login_history", void 0);
User = __decorate([
    typeorm_1.Entity('user'),
    typeorm_1.Unique(['cognito_user_id'])
], User);
exports.User = User;
