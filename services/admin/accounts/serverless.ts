import functions from './index';
import SharedConfig, { BaseServiceName } from '@libs/serverless-shared-custom';
import ServerlessWithStepFunctions from '@shared/typedServerlessStepFunction';

const serverlessConfiguration: ServerlessWithStepFunctions = {
    service: BaseServiceName + '-accounts',
    variablesResolutionMode: '20210326',
    useDotenv: true,
    disabledDeprecations: ['CLI_OPTIONS_SCHEMA'],
    frameworkVersion: '2',
    custom: {
        ...SharedConfig,
        // bundle: {
        //   aliases: [
        //     { "@entities": "../../../libs/entities/index.ts" },
        //     { "@subscribers": "../../../libs/entities/subscriptions.ts" },
        //     { "@libs": "../../../libs" },
        //     { "@shared": "../../../libs/shared" },
        //   ],
        //   excludeFiles: [".build/**.*"],
        // },
    },
    package: {
        individually: true,
    },
    plugins: [
        // "serverless-plugin-typescript",
        // "serverless-tscpaths",
        'serverless-bundle',
        'serverless-iam-roles-per-function',
    ],
    provider: {
        name: 'aws',
        region: 'ap-southeast-2',
        runtime: 'nodejs12.x',
        stage: "${opt:stage,'dev'}",
        timeout: 30,

        apiGateway: {
            restApiId: '${self:custom.API.ID}',
            restApiRootResourceId: '${self:custom.API.ROOT}',
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
