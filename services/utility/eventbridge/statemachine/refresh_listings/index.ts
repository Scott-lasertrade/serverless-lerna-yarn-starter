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
                    'detail-type': ['refresh_listings'],
                },
            },
        },
    ],
    iamRoleStatements: [
        {
            Sid: 'RefreshListingExecutionPolicy',
            Effect: 'Allow',
            Action: ['states:StartExecution'],
            Resource: {
                'Fn::ImportValue': 'REFRESH-LISTINGS-SM',
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
        REFRESHLISTINGVIEWS_ARN: {
            'Fn::ImportValue': 'REFRESH-LISTINGS-SM',
        },
        STAGE: '${self:provider.stage}',
    },
} as AWSFunction;
