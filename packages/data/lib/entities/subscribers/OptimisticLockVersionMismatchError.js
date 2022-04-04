"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimisticLockVersionMismatchError = void 0;
class OptimisticLockVersionMismatchError extends Error {
    constructor(entity, expectedVersion, actualVersion) {
        super();
        this.name = 'OptimisticLockVersionMismatchError';
        Reflect.setPrototypeOf(this, OptimisticLockVersionMismatchError.prototype);
        this.message = `The optimistic lock on entity ${entity} failed, version ${expectedVersion} was expected, but is actually ${actualVersion}.`;
    }
}
exports.OptimisticLockVersionMismatchError = OptimisticLockVersionMismatchError;
