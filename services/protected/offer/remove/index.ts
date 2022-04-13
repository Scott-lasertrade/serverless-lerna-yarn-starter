import { customCors, AWSFunction, handlerPath } from '@medii/api-lambda';
import schema from './schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            http: {
                method: 'put',
                path: '${self:custom.paths.protected}offer/remove/{oId}',
                cors: customCors,
                authorizer: 'aws_iam',
                request: {
                    schemas: {
                        'application/json': schema,
                    },
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
            Sid: 'AdminGetUserPolicy',
            Effect: 'Allow',
            Action: ['cognito-idp:AdminGetUser'],
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
            Sid: 'SESEmailPolicy',
            Effect: 'Allow',
            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
            Resource: '*',
        },
    ],
    environment: {
        HOSTING_DOMAIN:
            '${self:custom.COGNITO.HOSTEDDOMAIN.${self:provider.stage}}',
        COGNITO_USER_POOL_ID:
            '${self:custom.COGNITO.USERPOOLID.${self:provider.stage}}',
    },
} as AWSFunction;
