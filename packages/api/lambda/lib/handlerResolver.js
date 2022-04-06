"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerPath = void 0;
exports.handlerPath = (context) => {
    return `${context
        .split(process.cwd())[1]
        .substring(1)
        .replace(/\\/g, '/')}`;
};
