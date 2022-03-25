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
        s3: {
            host: 'localhost',
        },
        // plugin config
        additionalStacks: {
            apiGatewayStack: {
                StackName: '${self:service}-${self:provider.stage}-apigateway',
                Resources: {
                    SharedApiGateway: {
                        Type: 'AWS::ApiGateway::RestApi',
                        Properties: {
                            Name: '${self:service}-${self:provider.stage}',
                        },
                    },
                },
                Outputs: {
                    ApiGatewayRestApiId: {
                        Description: 'Shared ApiGateway Id',
                        Value: {
                            Ref: 'SharedApiGateway',
                        },
                        Export: {
                            Name: 'SHARED-API-ID',
                        },
                    },
                    ApiGatewayRestApiRootResourceId: {
                        Description: 'Shared ApiGateway root resource Id',
                        Value: {
                            'Fn::GetAtt': [
                                'SharedApiGateway',
                                'RootResourceId',
                            ],
                        },
                        Export: {
                            Name: 'SHARED-API-ROOT',
                        },
                    },
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
                    ProductsBucketARN: {
                        Description: 'The products bucket ARN',
                        Value: {
                            'Fn::GetAtt': ['ProductsBucket', 'Arn'],
                        },
                        Export: {
                            Name: 'PRODUCT-BUCKET-ARN',
                        },
                    },
                    ListingsBucketARN: {
                        Description: 'The listings bucket ARN',
                        Value: {
                            'Fn::GetAtt': ['ListingsBucket', 'Arn'],
                        },
                        Export: {
                            Name: 'LISTINGS-BUCKET-ARN',
                        },
                    },
                },
            },
            auroraStack: {
                StackName: '${self:service}-${self:provider.stage}-database',
                Resources: {
                    ...AuroraResources,
                },
                Outputs: {
                    AuroraClusterARN: {
                        Description: 'The aurora database ARN',
                        Value: {
                            'Fn::Sub':
                                'arn:${AWS::Partition}:rds:${AWS::Region}:${AWS::AccountId}:cluster:${AuroraRDSCluster}',
                        },
                        Export: {
                            Name: 'AURORA-ARN',
                        },
                    },
                    AuroraClusterSecretARN: {
                        Description: 'The aurora database secret ARN',
                        Value: {
                            Ref: 'AuroraAdminSecret',
                        },
                        Export: {
                            Name: 'AURORA-SECRET-ARN',
                        },
                    },
                },
            },
            cognitoStack: {
                StackName: '${self:service}-${self:provider.stage}-cognito',
                Resources: {
                    ...CognitoResources,
                },
                Outputs: {
                    AuthUserPoolId: {
                        Description: 'The Cognito User Pool',
                        Value: { Ref: 'CognitoUserPoolHandel' },
                        Export: {
                            Name: 'COGNITO-USER-POOL',
                        },
                    },
                    AuthIdentityPoolId: {
                        Description: 'The Cognito Identity Pool',
                        Value: { Ref: 'IdentityPool' },
                        Export: {
                            Name: 'COGNITO-IDENTITY-POOL',
                        },
                    },
                    AuthUserPoolWebClientId: {
                        Description: 'The Cognito User Pool Client',
                        Value: { Ref: 'CognitoUserPoolClient' },
                        Export: {
                            Name: 'COGNITO-USER-POOL-CLIENT',
                        },
                    },
                    AuthRegion: {
                        Description: 'The Cognito User Pool Region',
                        Value: {
                            Ref: 'AWS::Region',
                        },
                        Export: {
                            Name: 'COGNITO-REGION',
                        },
                    },
                    AuthOauthDomain: {
                        Description: 'The Cognito OAuth Domain',
                        Value: {
                            'Fn::Join': [
                                '.',
                                [
                                    { Ref: 'CognitoUserPoolDomain' },
                                    {
                                        'Fn::Sub':
                                            'auth.${AWS::Region}.amazoncognito.com',
                                    },
                                ],
                            ],
                        },
                        Export: {
                            Name: 'COGNITO-DOMAIN',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        'serverless-s3-local',
        'serverless-stack-output',
        'serverless-plugin-additional-stacks',
    ],
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
    resources: {
        Outputs: {
            AuthUserPoolId: {
                Value: '${self:custom.COGNITO.USERPOOLID.${self:provider.stage}}',
            },
            AuthIdentityPoolId: {
                Value: '${self:custom.COGNITO.IDENTITYPOOLID.${self:provider.stage}}',
            },
            AuthUserPoolWebClientId: {
                Value: '${self:custom.COGNITO.USERPOOLCLIENTID}',
            },
            AuthRegion: {
                Value: '${self:custom.COGNITO.REGION}',
            },
            AuthOauthDomain: {
                Value: '${self:custom.COGNITO.OAUTHDOMAIN}',
            },
            // S.Y: Not sure if we need this at the moment, as even if we pushed it, the front-end would need to understand which one to use.
            AuthCallBackUrls: {
                Value: {
                    'Fn::Join': [
                        ',',
                        '${self:custom.COGNITO.CALLBACKURLS.${self:provider.stage}}',
                    ],
                },
            },
            AuthLogoutUrls: {
                Value: {
                    'Fn::Join': [
                        ',',
                        '${self:custom.COGNITO.LOGOUTURLS.${self:provider.stage}}',
                    ],
                },
            },
            ApiName: {
                Value: '${self:service}-${self:provider.stage}',
            },
            ApiEndpoint: {
                Value: {
                    'Fn::Join': [
                        '',
                        [
                            'https://',
                            '${self:custom.API.ID}',
                            '.execute-api.${self:provider.region}.amazonaws.com/${self:provider.stage}',
                        ],
                    ],
                },
            },
            ApiRegion: {
                Value: '${self:provider.region}',
            },
        },
    },
};

module.exports = serverlessConfiguration;
