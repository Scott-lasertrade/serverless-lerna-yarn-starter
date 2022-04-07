"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST = exports.Database = void 0;
__exportStar(require("./entities"), exports);
__exportStar(require("./entities/subscriptions"), exports);
__exportStar(require("./entities/migrations"), exports);
__exportStar(require("./entities/utils/CommonEntity"), exports);
__exportStar(require("./entities/utils/ImageEntity"), exports);
__exportStar(require("./entities/utils/VersionControlledEntity"), exports);
var database_1 = require("./database");
Object.defineProperty(exports, "Database", { enumerable: true, get: function () { return __importDefault(database_1).default; } });
exports.TEST = 'TEST';
//# sourceMappingURL=index.js.map