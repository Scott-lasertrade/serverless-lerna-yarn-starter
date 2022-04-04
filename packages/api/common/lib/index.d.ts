export * from './apiGateway';
import middy from '@middy/core';
export declare const apiGatewayResponseMiddleware: (options?: {
    enableErrorLogger?: boolean;
}) => {
    after: middy.MiddlewareFn<APIGatewayProxyEvent, any, Error, LambdaContext>;
    onError: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult, Error, LambdaContext>;
};
//# sourceMappingURL=index.d.ts.map