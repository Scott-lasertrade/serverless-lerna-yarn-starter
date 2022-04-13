import { customCors, AWSFunction, handlerPath } from '@medii/api-lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            http: {
                method: 'get',
                path: '${self:custom.paths.admin}product/submission/count',
                cors: customCors,
                authorizer: 'aws_iam',
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
