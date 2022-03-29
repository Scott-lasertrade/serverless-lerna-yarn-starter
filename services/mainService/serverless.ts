// import functions from './src/functions';

// import StateMachines from './serverless/statemachines';
import CognitoResources from './serverless/cognito';
import AuroraResources from './serverless/aurora';
import StorageResources from './serverless/s3';
import SharedConfig, {
    BaseServiceName,
} from '../../libs/serverless-shared-custom';
// import ServerlessWithStepFunctions from '@libs/typedServerlessStepFunction';
import type { AWS } from '@serverless/typescript';
import AuroraOutputs from './serverless/aurora-outputs';
import CognitoOutputs from './serverless/cognito-outputs';
import StorageOutputs from './serverless/s3-outputs';
import APIGWResources from './serverless/apigateway';
import APIGWOutputs from './serverless/apigateway-outputs';
import Outputs from './serverless/outputs';

const serverlessConfiguration: AWS = {
    service: BaseServiceName,
    app: BaseServiceName,
    useDotenv: true,
    disabledDeprecations: ['CLI_OPTIONS_SCHEMA'],
    frameworkVersion: '2',
    custom: {
        ...SharedConfig,
        output: {
            file: 'serverless-config.json',
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
    plugins: ['serverless-stack-output', 'serverless-plugin-additional-stacks'],
    provider: {
        name: 'aws',
        region: 'ap-southeast-2',
        runtime: 'nodejs14.x',
        stage: "${opt:stage,'dev'}",
        timeout: 30,

        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
            restApiId: '${self:custom.API.ID}',
            restApiRootResourceId: '${self:custom.API.ROOT}',
        },
    },
    // import the function via paths
    resources: {
        Outputs: { ...Outputs },
    },
};

module.exports = serverlessConfiguration;
