import { AWSFunction, handlerPath } from '@medii/api-lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            eventBridge: {
                eventBus:
                    'arn:aws:events:ap-southeast-2:823044268509:event-bus/stripe-${self:provider.stage}',
                pattern: {
                    source: ['Stripe'],
                    'detail-type': ['payment_intent.payment_failed'],
                },
            },
        },
    ],
    iamRoleStatements: [
        {
            Sid: 'AuroraDataAccessPolicy',
            Effect: 'Allow',
            Action: ['rds-data:*'],
            Resource: ['${self:custom.AURORA.ARN}'],
        },
        {
            Sid: 'AuroraSecretAccessPolicy',
            Effect: 'Allow',
            Action: ['secretsmanager:GetSecretValue'],
            Resource: '${self:custom.AURORA.SECRET_ARN}',
        },
        {
            Sid: 'EventBridgeAccess',
            Effect: 'Allow',
            Action: ['events:PutEvents'],
            Resource: ['*'],
        },
    ],
    environment: {
        EVENT_BRIDGE_EMAIL: 'email',
        EVENT_BRIDGE_STATEMACHINE: 'statemachine',
        STAGE: '${self:provider.stage}',
    },
} as AWSFunction;
