import functions from './index';
import {
    BaseServiceName,
    SharedConfig,
    ServerlessWithStepFunctions,
} from '@medii/common';

const serverlessConfiguration: ServerlessWithStepFunctions = {
    service: BaseServiceName + '-migration',
    useDotenv: true,
    disabledDeprecations: ['CLI_OPTIONS_SCHEMA'],
    frameworkVersion: '2',
    custom: {
        ...SharedConfig,
        seed: {
            incremental: {
                enabled: true,
                disabledFor: ['prod', 'staging'],
            },
        },
        bundle: {
            // esbuild: false,
            ignorePackages: ['pg-native'],
            // disableForkTsChecker: true,
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
            restApiRootResourceId: '${self:custom.API.ROOT}',
        },

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
