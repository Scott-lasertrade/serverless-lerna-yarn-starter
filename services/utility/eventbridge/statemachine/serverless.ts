import functions from './index';
import {
    BaseServiceName,
    SharedConfig,
    ServerlessWithStepFunctions,
} from '@medii/common';

const serverlessConfiguration: ServerlessWithStepFunctions = {
    service: BaseServiceName + '-EB-SFN',
    configValidationMode: 'error',
    useDotenv: true,
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
            restApiRootResourceId: '${self:custom.API.ROOT}',
        },
    },
    // import the function via paths
    functions: functions,
};

module.exports = serverlessConfiguration;
