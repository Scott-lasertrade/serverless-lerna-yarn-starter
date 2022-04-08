import type { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://jack-psi.vercel.app',
    'https://scott.vercel.app',
    'https://www.lasersharks.click',
];

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
    body: FromSchema<S>;
};
export type newManufacturers: strinValidatedEventAPIGatewayProxyEvent<S> = Handler<
    ValidatedAPIGatewayProxyEvent<S>,
    any
>;

export const formatJSONResponse = (
    response: Record<string, unknown>,
    origin: string,
    statusCode: number = 200
) => {
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
    } else {
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
