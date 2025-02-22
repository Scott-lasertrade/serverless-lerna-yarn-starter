"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatJSONResponse = void 0;
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://jack-psi.vercel.app',
    'https://scott.vercel.app',
    'https://www.lasersharks.click',
];
const formatJSONResponse = (response, origin, statusCode = 200) => {
    if (ALLOWED_ORIGINS.includes(origin)) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': '*',
            },
            statusCode: statusCode,
            body: JSON.stringify(response),
        };
    }
    else {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Credentials': false,
            },
            statusCode: statusCode,
            body: JSON.stringify(response),
        };
    }
};
exports.formatJSONResponse = formatJSONResponse;
//# sourceMappingURL=apiGateway.js.map