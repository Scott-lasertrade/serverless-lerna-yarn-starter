import type { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
declare type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
    body: FromSchema<S>;
};
export declare type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, any>;
export declare const formatJSONResponse: (response: Record<string, unknown>, origin: string, statusCode?: number) => {
    headers: {
        'Content-Type': string;
        'Access-Control-Allow-Methods': string;
        'Access-Control-Allow-Origin': string;
        'Access-Control-Allow-Credentials': boolean;
        'Access-Control-Allow-Headers': string;
    };
    statusCode: number;
    body: string;
};
export {};
//# sourceMappingURL=apiGateway.d.ts.map