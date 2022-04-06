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
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiGatewayResponseMiddleware = void 0;
const common_1 = require("@medii/common");
const apiGateway_1 = require("./apiGateway");
__exportStar(require("./apiGateway"), exports);
exports.apiGatewayResponseMiddleware = (options = {}) => {
    // const before: MiddlewareFunction<APIGatewayProxyEvent, any> = async (
    //     request
    // ) => {
    //     if (!request.event.headers.authorizeduserid) {
    //         throw new AppError('AuthorizedUserId Header missing', 400);
    //     }
    //     request.event.headers.currentuserid =
    //         request.event.headers.currentuserid &&
    //         request.event.headers.currentuserid !== 'undefined'
    //             ? request.event.headers.currentuserid
    //             : request.event.headers.AuthorizedUserId?? event.headers.authorizeduserid;
    // };
    const after = (request) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!((_a = request.event) === null || _a === void 0 ? void 0 : _a.httpMethod) ||
            request.response === undefined ||
            request.response === null) {
            return;
        }
        const existingKeys = Object.keys(request.response);
        const isHttpResponse = existingKeys.includes('statusCode') &&
            existingKeys.includes('headers') &&
            existingKeys.includes('body');
        if (isHttpResponse) {
            return;
        }
        const origin = request.event.headers.Origin;
        request.response = apiGateway_1.formatJSONResponse(request.response, origin !== null && origin !== void 0 ? origin : '', (_b = request.response.statusCode) !== null && _b !== void 0 ? _b : 200);
    });
    const onError = (request) => __awaiter(void 0, void 0, void 0, function* () {
        const { error } = request;
        let statusCode = 500;
        if (error instanceof common_1.AppError) {
            statusCode = error.statusCode;
        }
        if (options.enableErrorLogger) {
            console.error(error);
        }
        const origin = request.event.headers.Origin;
        request.response = apiGateway_1.formatJSONResponse({ message: error === null || error === void 0 ? void 0 : error.message }, origin !== null && origin !== void 0 ? origin : '', statusCode);
        return Promise.resolve();
    });
    return {
        // before,
        after,
        onError,
    };
};
