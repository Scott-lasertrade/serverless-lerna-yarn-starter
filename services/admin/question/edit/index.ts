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
                path: 'question/{qId}/edit',
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
    ],
} as AWSFunction;
