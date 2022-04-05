import middy from '@middy/core';
import type { AWS } from '@serverless/typescript';
import { Context, Handler } from 'aws-lambda';
export * from './customCors';
export * from './handlerResolver';
export declare const middyfy: (handler: Handler) => middy.MiddyfiedHandler<any, any, Error, Context>;
export declare type AWSFunction = AWS['functions'][0];
export declare const handleTimeout: (prom: Promise<any>, context: Context, timeOutDeduction?: number) => Promise<any>;
declare type Definition = {
    Comment?: string;
    StartAt: string;
    States: {
        [state: string]: {
            Catch?: Catcher[];
            Choices?: Choice[];
            Type: 'Choice' | 'Fail' | 'Map' | 'Task' | 'Parallel' | 'Pass' | 'Wait';
            End?: boolean;
            Next?: string;
            Seconds?: number;
            TimestampPath?: string;
            ItemsPath?: string;
            ResultPath?: string;
            Resource?: string | {
                'Fn::GetAtt': string[];
            };
            Iterator?: Definition;
        };
    };
};
declare type Choice = {
    Variable: string;
    StringEquals: string;
    Next: string;
};
declare type Catcher = {
    ErrorEquals: ErrorName[];
    Next: string;
    ResultPath?: string;
};
declare type Event = {
    [http: string]: {
        path: string;
        method: 'POST' | 'GET' | 'PUT';
        authorizer?: 'aws_iam' | 'cognito';
        cors?: boolean;
    };
};
declare type ErrorName = 'States.ALL' | 'States.DataLimitExceeded' | 'States.Runtime' | 'States.Timeout' | 'States.TaskFailed' | 'States.Permissions' | string;
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
//# sourceMappingURL=index.d.ts.map