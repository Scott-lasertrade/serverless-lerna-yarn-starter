import { AppError } from '@medii/common';
import { formatJSONResponse } from './apiGateway';
export * from './apiGateway';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import MiddlewareFunction = middy.MiddlewareFn;

export const apiGatewayResponseMiddleware = (
    options: { enableErrorLogger?: boolean } = {}
) => {
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

    const after: MiddlewareFunction<APIGatewayProxyEvent, any> = async (
        request
    ) => {
        if (
            !request.event?.httpMethod ||
            request.response === undefined ||
            request.response === null
        ) {
            return;
        }

        const existingKeys = Object.keys(request.response);
        const isHttpResponse =
            existingKeys.includes('statusCode') &&
            existingKeys.includes('headers') &&
            existingKeys.includes('body');

        if (isHttpResponse) {
            return;
        }
        const origin = request.event.headers.Origin;
        request.response = formatJSONResponse(
            request.response,
            origin ?? '',
            request.response.statusCode ?? 200
        );
    };

    const onError: MiddlewareFunction<
        APIGatewayProxyEvent,
        APIGatewayProxyResult
    > = async (request) => {
        const { error } = request;
        let statusCode = 500;

        if (error instanceof AppError) {
            statusCode = error.statusCode;
        }

        if (options.enableErrorLogger) {
            console.error(error);
        }

        const origin = request.event.headers.Origin;
        request.response = formatJSONResponse(
            { message: error?.message },
            origin ?? '',
            statusCode
        );
        return Promise.resolve();
    };

    return {
        // before,
        after,
        onError,
    };
};
