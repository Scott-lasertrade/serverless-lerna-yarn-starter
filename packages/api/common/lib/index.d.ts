export * from './apiGateway';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
export declare const apiGatewayResponseMiddleware: (options?: {
    enableErrorLogger?: boolean;
}) => {
    after: middy.MiddlewareFn<APIGatewayProxyEvent, any, Error, import("aws-lambda").Context>;
    onError: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult, Error, import("aws-lambda").Context>;
};
//# sourceMappingURL=index.d.ts.map