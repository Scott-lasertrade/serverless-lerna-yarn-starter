"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTimeout = exports.middyfy = void 0;
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const api_common_1 = require("@medii/api-common");
const common_1 = require("@medii/common");
__exportStar(require("./customCors"), exports);
__exportStar(require("./handlerResolver"), exports);
exports.middyfy = (handler) => {
    return core_1.default(handler)
        .use(http_json_body_parser_1.default())
        .use(api_common_1.apiGatewayResponseMiddleware({
        enableErrorLogger: process.env.IS_OFFLINE === 'true',
    }));
};
exports.handleTimeout = (prom, context, timeOutDeduction = 500) => __awaiter(void 0, void 0, void 0, function* () {
    context.callbackWaitsForEmptyEventLoop = false;
    const lambdaTimeout = new Promise(function (resolve) {
        setTimeout(resolve, context.getRemainingTimeInMillis() - timeOutDeduction);
    }).then(() => {
        throw new common_1.AppError('Lambda timed out.', 504);
    });
    try {
        const res = yield Promise.race([prom, lambdaTimeout]);
        return res;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
