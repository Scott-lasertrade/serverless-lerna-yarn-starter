import schema from './schema';
import { customCors, AWSFunction, handlerPath } from '@medii/api-lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            http: {
                method: 'post',
                path: 'listing/{id}/images/update',
                cors: customCors,
                authorizer: 'aws_iam',
                request: {
                    schema: {
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
            Effect: 'Allow',
            Action: [
                's3:ListBucket',
                's3:PutObject',
                's3:DeleteObject',
                's3:DeleteObjectVersion',
                's3:GetObject',
            ],
            Resource: [
                '${self:custom.STORAGE.LISTINGSBUCKETARN}',
                {
                    'Fn::Join': [
                        '/',
                        ['${self:custom.STORAGE.LISTINGSBUCKETARN}', '*'],
                    ],
                },
            ],
        },
    ],
    environment: {
        LISTINGBUCKETNAME: '${self:custom.STORAGE.LISTINGSBUCKETNAME}',
    },
} as AWSFunction;
