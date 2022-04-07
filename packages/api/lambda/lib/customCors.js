"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customCors = void 0;
exports.customCors = {
    origin: '*',
    headers: [
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
        'X-Amz-Security-Token',
        'X-Amz-User-Agent',
        'AuthorizedUserId',
        'CurrentuserId',
    ],
    allowCredentials: false,
};
//# sourceMappingURL=customCors.js.map