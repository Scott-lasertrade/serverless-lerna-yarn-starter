// import functions from './src/functions';

// import StateMachines from './serverless/statemachines';
import CognitoResources from './mainService/serverless/cognito';
import AuroraResources from './mainService/serverless/aurora';
import StorageResources from './mainService/serverless/s3';
import SharedConfig from '@libs/serverless-shared-custom';
import adminAccountFunctions from './admin/accounts/index';
import adminCategoryFunctions from './admin/category/index';

const functions = { ...adminAccountFunctions, ...adminCategoryFunctions };

import ServerlessWithStepFunctions from '@package/lambda-package';
import Outputs from './mainService/serverless/outputs';
import CognitoOutputs from './mainService/serverless/cognito-outputs';
import AuroraOutputs from './mainService/serverless/aurora-outputs';
import StorageOutputs from './mainService/serverless/s3-outputs';
import APIGWOutputs from './mainService/serverless/apigateway-outputs';
import APIGWResources from './mainService/serverless/apigateway';

const serverlessConfiguration: ServerlessWithStepFunctions = {
    service: '${self:custom.BaseServiceName}',
    app: '${self:custom.BaseServiceName}',
    useDotenv: true,
    disabledDeprecations: ['CLI_OPTIONS_SCHEMA'],
    frameworkVersion: '2',
    custom: {
        ...SharedConfig,
        // stepFunctionsLocal: {
        //     accountId: 101010101010,
        //     region: 'ap-southeast-2',
        //     lambdaEndpoint: 'http://localhost:3002',
        //     TaskResourceMapping: {
        //         RefreshListingViews:
        //             'arn:aws:lambda:${self:provider.region}:101010101010:function:${self:service}-${self:provider.stage}-refreshListingViews',
        //         ExpireOffer:
        //             'arn:aws:lambda:${self:provider.region}:101010101010:function:${self:service}-${self:provider.stage}-expireOffer',
        //         ReinstateListings:
        //             'arn:aws:lambda:${self:provider.region}:101010101010:function:${self:service}-${self:provider.stage}-reinstateListings',
        //     },
        // },
        s3: {
            host: 'localhost',
        },
        // plugin config
        additionalStacks: {
            apiGatewayStack: {
                StackName: '${self:service}-${self:provider.stage}-apigateway',
                Resources: {
                    ...APIGWResources,
                },
                Outputs: {
                    ...APIGWOutputs,
                },
            },
            // Stack name
            s3BucketsStack: {
                // CloudFormation
                StackName: '${self:service}-${self:provider.stage}-s3buckets',
                Resources: {
                    ...StorageResources,
                },
                Outputs: {
                    ...StorageOutputs,
                },
            },
            auroraStack: {
                StackName: '${self:service}-${self:provider.stage}-database',
                Resources: {
                    ...AuroraResources,
                },
                Outputs: {
                    ...AuroraOutputs,
                },
            },
            cognitoStack: {
                StackName: '${self:service}-${self:provider.stage}-cognito',
                Resources: {
                    ...CognitoResources,
                },
                Outputs: {
                    ...CognitoOutputs,
                },
            },
        },
    },
    plugins: [
        // 'serverless-step-functions',
        // 'serverless-step-functions-local',
        'serverless-offline',
        // 'serverless-offline-aws-eventbridge',
        'serverless-s3-local',
        'serverless-iam-roles-per-function',
        'serverless-plugin-additional-stacks',
        // 'serverless-plugin-split-stacks',
        'serverless-bundle',
    ],
    package: {
        individually: true,
    },
    provider: {
        name: 'aws',
        region: 'ap-southeast-2',
        runtime: 'nodejs12.x',
        stage: "${opt:stage,'dev'}",
        timeout: 30,

        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
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
    // stepFunctions: StateMachines,
    resources: {
        Outputs: { ...Outputs },
    },
};

module.exports = serverlessConfiguration;
