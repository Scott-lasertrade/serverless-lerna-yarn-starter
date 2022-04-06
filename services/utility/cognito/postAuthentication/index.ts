import { handlerPath } from '@medii/api-lambda';
import { UserpoolTriggers } from '@medii/common';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            // Try altering the name to match existing
            cognitoUserPool: {
                pool: '${self:custom.COGNITO.USERPOOLNAME.${self:provider.stage}}',
                trigger: UserpoolTriggers.PostAuthentication,
                existing: true,
            },
        },
    ],
    iamRoleStatements: [
        {
            Sid: 'PostAuthenticationLinkPolicy',
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
    ],
};
