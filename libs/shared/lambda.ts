import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import type { AWS } from '@serverless/typescript';
import { Context, Handler } from 'aws-lambda';
import { AppError } from './appError';
import { apiGatewayResponseMiddleware } from './middleware';

export const middyfy = (handler: Handler) => {
    return middy(handler)
        .use(middyJsonBodyParser())
        .use(
            apiGatewayResponseMiddleware({
                enableErrorLogger: process.env.IS_OFFLINE === 'true',
            })
        );
};
export type AWSFunction = AWS['functions'][0];

export const handleTimeout = async (
    prom: Promise<any>,
    context: Context,
    timeOutDeduction: number = 500
) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const lambdaTimeout = new Promise(function (resolve) {
        setTimeout(
            resolve,
            context.getRemainingTimeInMillis() - timeOutDeduction
        );
    }).then(() => {
        throw new AppError('Lambda timed out.', 504);
    });

    try {
        const res = await Promise.race([prom, lambdaTimeout]);
        return res;
    } catch (err) {
        console.log(err);
        throw err;
    }
};
