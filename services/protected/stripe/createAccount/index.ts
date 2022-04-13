import { customCors, AWSFunction, handlerPath } from '@medii/api-lambda';
import schema from './schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            http: {
                method: 'post',
                path: '${self:custom.paths.protected}stripe/create-account',
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
    ],
    environment: {
        STRIPESECRETKEY:
            '${self:custom.STRIPE.${self:provider.stage}.SECRETKEY}',
        HOSTING_DOMAIN:
            '${self:custom.COGNITO.HOSTEDDOMAIN.${self:provider.stage}}',
        HAPIKEY: '${self:custom.HUBSPOT.${self:provider.stage}.HAPIKEY}',
    },
} as AWSFunction;