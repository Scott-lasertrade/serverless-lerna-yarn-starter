import functions from './index';
import StateMachines from './statemachines';
import {
    BaseServiceName,
    SharedConfig,
    ServerlessWithStepFunctions,
} from '@medii/common';

const serverlessConfiguration: ServerlessWithStepFunctions = {
    service: BaseServiceName + '-ut-SFN',
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
            ignorePackages: ['pg-native'],
        },
    },
    package: {
        individually: true,
    },
    plugins: [
        'serverless-bundle',
        'serverless-step-functions',
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
    stepFunctions: StateMachines,
    resources: {
        Outputs: {
            SMRefreshListingViewsArn: {
                Value: {
                    Ref: 'SMRefreshListingViewsDash${self:provider.stage}',
                },
                Export: {
                    Name: '${self:provider.stage}-REFRESH-LISTINGS-SM',
                },
            },
            SMReinstateListingsArn: {
                Value: {
                    Ref: 'SMReinstateListingsDash${self:provider.stage}',
                },
                Export: {
                    Name: '${self:provider.stage}-REINSTATE-LISTINGS-SM',
                },
            },
            SMExpireOfferArn: {
                Value: {
                    Ref: 'SMExpireOfferDash${self:provider.stage}',
                },
                Export: {
                    Name: '${self:provider.stage}-EXPIRE-OFFER-SM',
                },
            },
        },
    },
};

module.exports = serverlessConfiguration;
