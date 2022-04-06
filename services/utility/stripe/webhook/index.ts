import { AWSFunction, handlerPath } from '@medii/api-lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            http: {
                method: 'post',
                path: 'stripe/webhook',
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
    environment: {
        STRIPESECRETKEY:
            '${self:custom.STRIPE.${self:provider.stage}.SECRETKEY}',
        STRIPEWEBHOOK: '${self:custom.STRIPE.${self:provider.stage}.WEBHOOK}',
        EVENT_BRIDGE: 'stripe',
        STAGE: '${self:provider.stage}',
    },
} as AWSFunction;
