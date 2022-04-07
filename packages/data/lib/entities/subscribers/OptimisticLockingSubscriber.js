"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimisticLockingSubscriber = void 0;
const typeorm_1 = require("typeorm");
const OptimisticLockVersionMismatchError_1 = require("./OptimisticLockVersionMismatchError");
let OptimisticLockingSubscriber = class OptimisticLockingSubscriber {
    beforeUpdate(event) {
        if (event.metadata.versionColumn && event.entity) {
            const versionFromUpdate = Reflect.get(event.entity, event.metadata.versionColumn.propertyName);
            const versionFromDatabase = event.databaseEntity[event.metadata.versionColumn.propertyName];
            if (versionFromDatabase !== versionFromUpdate) {
                throw new OptimisticLockVersionMismatchError_1.OptimisticLockVersionMismatchError(event.metadata.tableName, versionFromDatabase, versionFromUpdate);
            }
        }
    }
    beforeRemove(event) {
        if (event.metadata.versionColumn && event.entity) {
            const versionFromRemove = Reflect.get(event.entity, event.metadata.versionColumn.propertyName);
            const versionFromDatabase = event.databaseEntity[event.metadata.versionColumn.propertyName];
            if (versionFromDatabase !== versionFromRemove) {
                throw new OptimisticLockVersionMismatchError_1.OptimisticLockVersionMismatchError(event.metadata.tableName, versionFromDatabase, versionFromRemove);
            }
        }
    }
};
OptimisticLockingSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], OptimisticLockingSubscriber);
exports.OptimisticLockingSubscriber = OptimisticLockingSubscriber;
//# sourceMappingURL=OptimisticLockingSubscriber.js.map