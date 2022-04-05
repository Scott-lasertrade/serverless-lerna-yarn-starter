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
                trigger: UserpoolTriggers.PreSignUp,
                existing: true,
            },
        },
    ],
    iamRoleStatements: [
        {
            Sid: 'PreSignUpLinkPolicy',
            Effect: 'Allow',
            Action: [
                'cognito-idp:AdminAddUserToGroup',
                'cognito-idp:AdminUpdateUserAttributes',
                'cognito-idp:ListUsers',
                'cognito-idp:AdminLinkProviderForUser',
                'cognito-idp:AdminCreateUser',
                'cognito-idp:AdminSetUserPassword',
            ],
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
