// import functions from './src/functions';

// import StateMachines from './serverless/statemachines';
import CognitoResources from './mainService/serverless/cognito';
import AuroraResources from './mainService/serverless/aurora';
import StorageResources from './mainService/serverless/s3';
import adminAccountFunctions from './admin/accounts/index';
import adminCategoryFunctions from './admin/category/index';
import adminListingFunctions from './admin/listing/index';
import adminManufacturerFunctions from './admin/manufacturer/index';
import adminOfferFunctions from './admin/offers/index';
import adminOrderFunctions from './admin/orders/index';
import adminProductFunctions from './admin/product/index';
import adminQuestionFunctions from './admin/question/index';

import protectedAccountFunctions from './protected/account/index';
import protectedAddressFunctions from './protected/address/index';
import protectedCartFunctions from './protected/cart/index';
import protectedCheckoutFunctions from './protected/checkout/index';
import protectedDealFunctions from './protected/deal/index';
import protectedListingFunctions from './protected/listing/index';
import protectedOfferFunctions from './protected/offer/index';
import protectedOrderFunctions from './protected/order/index';
import protectedQuestionFunctions from './protected/question/index';
import protectedStorageFunctions from './protected/storage/index';
import protectedStripeFunctions from './protected/stripe/index';
import protectedUserFunctions from './protected/user/index';
import protectedWatchlistFunctions from './protected/watchlist/index';

import publicCategoryFunctions from './public/category/index';
import publicCountryFunctions from './public/country/index';
import publicCurrencyTypeFunctions from './public/currencyType/index';
import publicGoogleReviewFunctions from './public/googleReviews/index';
import publicHelloFunctions from './public/hello/index';
import publicListingFunctions from './public/listing/index';
import publicManufacturerFunctions from './public/manufacturer/index';
import publicOfferFunctions from './public/offer/index';
import publicProductFunctions from './public/product/index';
import publicProductTypeFunctions from './public/productType/index';
import publicQuestionFunctions from './public/question/index';
import publicStorageFunctions from './public/storage/index';
import publicTransactionFunctions from './public/transaction/index';
import publicUsageTypeFunctions from './public/usageType/index';
import publicUserFunctions from './public/user/index';
import publicWatchlistFunctions from './public/watchlist/index';

import cognitoFunctions from './utility/cognito/index';
import stateMachineFunctions from './utility/statemachine/index';

const functions = {
    ...adminAccountFunctions,
    ...adminCategoryFunctions,
    ...adminListingFunctions,
    ...adminManufacturerFunctions,
    ...adminOfferFunctions,
    ...adminOrderFunctions,
    ...adminProductFunctions,
    ...adminQuestionFunctions,
    ...protectedAccountFunctions,
    ...protectedAddressFunctions,
    ...protectedCartFunctions,
    ...protectedCheckoutFunctions,
    ...protectedDealFunctions,
    ...protectedListingFunctions,
    ...protectedOfferFunctions,
    ...protectedOrderFunctions,
    ...protectedQuestionFunctions,
    ...protectedStorageFunctions,
    ...protectedStripeFunctions,
    ...protectedUserFunctions,
    ...protectedWatchlistFunctions,
    ...publicCategoryFunctions,
    ...publicCountryFunctions,
    ...publicCurrencyTypeFunctions,
    ...publicGoogleReviewFunctions,
    ...publicHelloFunctions,
    ...publicListingFunctions,
    ...publicManufacturerFunctions,
    ...publicOfferFunctions,
    ...publicProductFunctions,
    ...publicProductTypeFunctions,
    ...publicQuestionFunctions,
    ...publicStorageFunctions,
    ...publicTransactionFunctions,
    ...publicUsageTypeFunctions,
    ...publicUserFunctions,
    ...publicWatchlistFunctions,
    ...cognitoFunctions,
    ...stateMachineFunctions,
};

import {
    ServerlessWithStepFunctions,
    BaseServiceName,
    SharedConfig,
} from '@medii/common';
import Outputs from './mainService/serverless/outputs';
import CognitoOutputs from './mainService/serverless/cognito-outputs';
import AuroraOutputs from './mainService/serverless/aurora-outputs';
import StorageOutputs from './mainService/serverless/s3-outputs';
import APIGWOutputs from './mainService/serverless/apigateway-outputs';
import APIGWResources from './mainService/serverless/apigateway';
import StateMachines from './utility/statemachine/statemachines';

const serverlessConfiguration: ServerlessWithStepFunctions = {
    service: BaseServiceName,
    app: BaseServiceName,
    useDotenv: true,
    disabledDeprecations: ['CLI_OPTIONS_SCHEMA'],
    frameworkVersion: '3',
    configValidationMode: 'error',
    custom: {
        // OFFLINE: true,`
        ...SharedConfig,
        paths: {
            admin: 'admin/',
            protected: 'protected/',
            public: 'public/',
        },
        stepFunctionsLocal: {
            accountId: 101010101010,
            region: 'ap-southeast-2',
            lambdaEndpoint: 'http://localhost:3002',
            TaskResourceMapping: {
                RefreshListingViews:
                    'arn:aws:lambda:${self:provider.region}:101010101010:function:${self:service}-${self:provider.stage}-refreshShopViews',
                ExpireOffer:
                    'arn:aws:lambda:${self:provider.region}:101010101010:function:${self:service}-${self:provider.stage}-expireOffer',
                ReinstateListings:
                    'arn:aws:lambda:${self:provider.region}:101010101010:function:${self:service}-${self:provider.stage}-reinstateListings',
            },
        },
        s3: {
            host: 'localhost',
        },
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
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
        'serverless-webpack',
        'serverless-step-functions',
        'serverless-step-functions-local',
        'serverless-offline-lambda',
        'serverless-offline',
        // 'serverless-offline-aws-eventbridge',
        'serverless-s3-local',
        'serverless-iam-roles-per-function',
        'serverless-plugin-additional-stacks',
        // 'serverless-plugin-split-stacks',
        // 'serverless-bundle',
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
    stepFunctions: StateMachines,
    resources: {
        Outputs: { ...Outputs },
    },
};

module.exports = serverlessConfiguration;
