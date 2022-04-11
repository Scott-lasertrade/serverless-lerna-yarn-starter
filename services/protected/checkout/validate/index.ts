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
                path: 'checkout/validate',
                cors: customCors,
                authorizer: 'aws_iam',
                reqValidatorName: {
                    'Fn::ImportValue':
                        '${self:provider.stage}-SHARED-REQUEST-VALIDATOR',
                },
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
    environment: {
        STRIPESECRETKEY:
            '${self:custom.STRIPE.${self:provider.stage}.SECRETKEY}',
    },
} as AWSFunction;
