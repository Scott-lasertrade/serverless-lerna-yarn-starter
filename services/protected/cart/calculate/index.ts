import schema from './schema';
import { customCors, AWSFunction, handlerPath } from '@medii/api-lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 30,
    versionFunction: false,
    events: [
        {
            http: {
                method: 'post',
                path: 'cart/calculate',
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
        TVAPIKEY: '${self:custom.TRANSVIRTUAL.${self:provider.stage}.APIKEY}',
        TVCUSTOMER_CODE:
            '${self:custom.TRANSVIRTUAL.${self:provider.stage}.CUSTOMER_CODE}',
    },
} as AWSFunction;
