import functions from './index';
import { BaseServiceName, SharedConfig } from '@medii/common';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
    service: BaseServiceName + '-prot-account',
    useDotenv: true,
    configValidationMode: 'error',
    disabledDeprecations: ['CLI_OPTIONS_SCHEMA'],
    frameworkVersion: '3',
    custom: {
        ...SharedConfig,
        seed: {
            incremental: {
                enabled: true,
                disabledFor: ['prod', 'staging'],
            },
        },
        bundle: {
            ignorePackages: ['pg-native'],
            disableForkTsChecker: true,
        },
    },
    package: {
        individually: true,
    },
    plugins: [
        'serverless-bundle',
        'serverless-iam-roles-per-function',
        'serverless-seed',
    ],
    provider: {
        name: 'aws',
        region: 'ap-southeast-2',
        runtime: 'nodejs14.x',
        stage: "${opt:stage,'dev'}",
        timeout: 30,

        apiGateway: {
            restApiId: '${self:custom.API.ID}',
            restApiRootResourceId: '${self:custom.API.PROTECTED}',
        },

        // S.Y. Environment variables for ALL Lambdas
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            AURORA_DB_ARN: '${self:custom.AURORA.ARN}',
            SECRET_ARN: '${self:custom.AURORA.SECRET_ARN}',
            DATABASE_NAME: '${self:custom.AURORA.DB_NAME}',
            REGION: '${self:provider.region}',
        },
    },
    // import the function via paths
    functions: functions,
};

module.exports = serverlessConfiguration;
