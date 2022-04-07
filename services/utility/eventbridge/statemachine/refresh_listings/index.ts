import { AWSFunction, handlerPath } from '@medii/api-lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            eventBridge: {
                eventBus:
                    'arn:aws:events:ap-southeast-2:823044268509:event-bus/statemachine-${self:provider.stage}',
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
                'Fn::ImportValue': '${self:provider.stage}-REFRESH-LISTINGS-SM',
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
            'Fn::ImportValue': '${self:provider.stage}-REFRESH-LISTINGS-SM',
        },
        STAGE: '${self:provider.stage}',
    },
} as AWSFunction;
