import { AWSFunction, handlerPath } from '@medii/api-lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            eventBridge: {
                eventBus: 'statemachine-${self:provider.stage}',
                pattern: {
                    source: ['Statemachine'],
                    'detail-type': ['expire_offer'],
                },
            },
        },
    ],
    iamRoleStatements: [
        {
            Sid: 'ExpireOfferExecutionPolicy',
            Effect: 'Allow',
            Action: ['states:StartExecution'],
            Resource: {
                'Fn::ImportValue': '${self:provider.stage}-EXPIRE-OFFER-SM',
            },
        },
        {
            Sid: 'EventBridgeAccess',
            Effect: 'Allow',
            Action: ['events:PutEvents'],
            Resource: ['*'],
        },
    ],
    environment: {
        EXPIREOFFER_ARN: {
            'Fn::ImportValue': '${self:provider.stage}-EXPIRE-OFFER-SM',
        },
        STAGE: '${self:provider.stage}',
    },
} as AWSFunction;
