import { handlerPath } from '@medii/api-lambda';
import { UserpoolTriggers } from 'UserpoolTriggers';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            cognitoUserPool: {
                pool: '${self:custom.COGNITO.USERPOOLNAME.${self:provider.stage}}',
                trigger: UserpoolTriggers.PostConfirmation,
                existing: true,
            },
        },
    ],
    iamRoleStatements: [
        {
            Sid: 'PostConfirmationLinkPolicy',
            Effect: 'Allow',
            Action: ['cognito-idp:AdminUpdateUserAttributes'],
            Resource: [
                {
                    'Fn::Join': [
                        ':',
                        [
                            'arn:aws:cognito-idp',
                            {
                                Ref: 'AWS::Region',
                            },
                            {
                                Ref: 'AWS::AccountId',
                            },
                            '*',
                        ],
                    ],
                },
            ],
        },
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
            Effect: 'Allow',
            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
            Resource: '*',
        },
    ],
    environment: {
        HOSTING_DOMAIN:
            '${self:custom.COGNITO.HOSTEDDOMAIN.${self:provider.stage}}',
    },
};
