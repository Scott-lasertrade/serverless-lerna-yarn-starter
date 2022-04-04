import { customCors, AWSFunction, handlerPath } from '@medii/api-lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            http: {
                method: 'post',
                path: 'public/hello',
                cors: customCors,
            },
        },
    ],
    iamRoleStatements: [
        {
            Sid: 'EventBridgeAccess',
            Effect: 'Allow',
            Action: ['events:PutEvents'],
            Resource: ['*'],
        },
    ],
} as AWSFunction;
