import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import type { AWS } from '@serverless/typescript';
import { Context, Handler } from 'aws-lambda';
import { AppError } from '../../libs/shared/appError';
import { apiGatewayResponseMiddleware } from '../../libs/shared/middleware';

export const middyfy = (handler: Handler) => {
    console.log('HI', handler);
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

type Definition = {
    Comment?: string;
    StartAt: string;
    States: {
        [state: string]: {
            Catch?: Catcher[];
            Choices?: Choice[];
            Type:
                | 'Choice'
                | 'Fail'
                | 'Map'
                | 'Task'
                | 'Parallel'
                | 'Pass'
                | 'Wait';
            End?: boolean;
            Next?: string;
            Seconds?: number;
            TimestampPath?: string;
            ItemsPath?: string;
            ResultPath?: string;
            Resource?: string | { 'Fn::GetAtt': string[] };
            Iterator?: Definition;
        };
    };
};

type Choice = {
    Variable: string;
    StringEquals: string;
    Next: string;
};

type Catcher = {
    ErrorEquals: ErrorName[];
    Next: string;
    ResultPath?: string;
};

type Event = {
    [http: string]: {
        path: string;
        method: 'POST' | 'GET' | 'PUT';
        authorizer?: 'aws_iam' | 'cognito';
        cors?: boolean;
    };
};

type ErrorName =
    | 'States.ALL'
    | 'States.DataLimitExceeded'
    | 'States.Runtime'
    | 'States.Timeout'
    | 'States.TaskFailed'
    | 'States.Permissions'
    | string;

export interface StateMachine {
    stateMachines: {
        [stateMachine: string]: {
            name: string;
            events?: Event;
            definition: Definition;
        };
    };
    activities?: string[];
    validate?: boolean;
}

export default interface ServerlessWithStepFunctions extends AWS {
    stepFunctions?: StateMachine;
}
