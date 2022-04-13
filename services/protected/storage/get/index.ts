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
                path: '${self:custom.paths.protected}storage/get',
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
            Effect: 'Allow',
            Action: ['s3:ListBucket', 's3:GetObject'],
            Resource: [
                '${self:custom.STORAGE.PRODUCTBUCKETARN}',
                {
                    'Fn::Join': [
                        '/',
                        ['${self:custom.STORAGE.PRODUCTBUCKETARN}', '*'],
                    ],
                },
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
} as AWSFunction;
