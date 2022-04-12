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
                    'detail-type': ['reinstate_listings'],
                },
            },
        },
    ],
    iamRoleStatements: [
        {
            Sid: 'ReinstateListingExecutionPolicy',
            Effect: 'Allow',
            Action: ['states:StartExecution'],
            Resource: {
                'Fn::ImportValue':
                    '${self:provider.stage}-REINSTATE-LISTINGS-SM',
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
        REINSTATELISTINGS_ARN: {
            'Fn::ImportValue': '${self:provider.stage}-REINSTATE-LISTINGS-SM',
        },
        STAGE: '${self:provider.stage}',
    },
} as AWSFunction;
