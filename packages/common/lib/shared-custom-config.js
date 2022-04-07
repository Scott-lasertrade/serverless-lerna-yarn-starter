"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedConfig = exports.BaseServiceName = void 0;
exports.BaseServiceName = 'medii';
exports.SharedConfig = {
    enterprise: {
        collectLambdaLogs: false,
    },
    TRANSVIRTUAL: {
        prod: '${ssm:/aws/reference/secretsmanager/prod/transvirtual~true}',
        dev: '${ssm:/aws/reference/secretsmanager/dev/transvirtual~true}',
        offline: {
            APIKEY: '78746|YRMKTSNZZP',
            CUSTOMER_CODE: 'LASRTECH',
        },
    },
    OFFER: {
        DEFAULT_EXPIRY: {
            offline: 1 * 60 * 1000,
            dev: 30 * 60 * 1000,
            prod: 72 * 60 * 60 * 1000,
        },
    },
    STRIPE: {
        prod: '${ssm:/aws/reference/secretsmanager/prod/stripe~true}',
        dev: '${ssm:/aws/reference/secretsmanager/dev/stripe~true}',
        offline: {
            SECRETKEY: 'sk_test_51HINWDDpQDarlqIHMzsLZ8kHsv8Onk2ReTy8PvJ5rbmG9mqTmXAheYcdVXMDtIHVVFO4Io6sgZEHRe1gM8NLoHjU00wpnl0GX7',
            PUBLISHABLEKEY: 'pk_test_51HINWDDpQDarlqIHPyO2gQGWoTQb8OHDhdu32voQIa7ZAbE2nePE3neA21B6o7kqJMNnAlw4TazZlwSSTaaRTwkl00jzIAZGwO',
            CLIENTID: 'ca_KZA5qFeOZRXYelvz9XklgtD1PgDuRZWZ',
            WEBHOOK: 'whsec_83f6b3e47b2deaaf94d672861150ce1a9fac74e4caa6e7214d0dc5b6ec0b6201',
        },
    },
    AURORA: {
        ARN: {
            'Fn::ImportValue': '${self:provider.stage}-AURORA-ARN',
        },
        SECRET_ARN: {
            'Fn::ImportValue': '${self:provider.stage}-AURORA-SECRET-ARN',
        },
        VPC_CIDR: 10,
        DB_NAME: 'marketplacedb_${self:provider.stage}',
        AUTOPAUSE: {
            prod: false,
            dev: true,
            offline: true,
        },
    },
    API: {
        ID: {
            'Fn::ImportValue': '${self:provider.stage}-SHARED-API-ID',
        },
        ROOT: {
            'Fn::ImportValue': '${self:provider.stage}-SHARED-API-ROOT',
        },
        ADMIN: {
            'Fn::ImportValue': '${self:provider.stage}-ADMIN-API-ROOT',
        },
    },
    COGNITO: {
        USERPOOLNAME: {
            offline: 'medii-dev',
            dev: 'medii-${self:provider.stage}',
            prod: 'medii-${self:provider.stage}',
        },
        USERPOOLID: {
            offline: 'ap-southeast-2_1q0PND3QW',
            dev: {
                'Fn::ImportValue': '${self:provider.stage}-COGNITO-USER-POOL',
            },
            prod: {
                'Fn::ImportValue': '${self:provider.stage}-COGNITO-USER-POOL',
            },
        },
        IDENTITYPOOLID: {
            offline: 'TODO - VALUE',
            dev: {
                'Fn::ImportValue': '${self:provider.stage}-COGNITO-IDENTITY-POOL',
            },
            prod: {
                'Fn::ImportValue': '${self:provider.stage}-COGNITO-IDENTITY-POOL',
            },
        },
        USERPOOLCLIENTID: {
            'Fn::ImportValue': '${self:provider.stage}-COGNITO-USER-POOL-CLIENT',
        },
        REGION: {
            'Fn::ImportValue': '${self:provider.stage}-COGNITO-REGION',
        },
        OAUTHDOMAIN: {
            'Fn::ImportValue': '${self:provider.stage}-COGNITO-DOMAIN',
        },
        IDENTITYPOOLNAME: {
            offline: 'medii-dev',
            dev: 'medii-${self:provider.stage}',
            prod: 'medii-${self:provider.stage}',
        },
        DOMAINNAME: {
            offline: 'medii-dev',
            dev: 'medii-${self:provider.stage}',
            prod: 'medii-${self:provider.stage}',
        },
        CALLBACKURLS: {
            offline: ['http://localhost:3000/auth/federated-sign-in'],
            dev: [
                'http://localhost:3000/auth/federated-sign-in',
                'https://matt-rouge.vercel.app/auth/federated-sign-in',
                'https://scott.vercel.app/auth/federated-sign-in',
                'https://www.lasersharks.click/auth/federated-sign-in',
            ],
            prod: ['https://maketplace-prod.vercel.app/auth/federated-sign-in'],
        },
        LOGOUTURLS: {
            offline: ['http://localhost:3000/auth/logout'],
            dev: [
                'http://localhost:3000/auth/logout',
                'https://www.lasersharks.click/auth/logout',
                'https://scott.vercel.app/auth/logout',
                'https://matt-rouge.vercel.app/auth/logout',
            ],
            prod: ['https://maketplace-prod.vercel.app/auth/logout'],
        },
        HOSTEDDOMAIN: {
            offline: 'http://localhost:3000',
            dev: 'https://lasersharks.click',
            prod: 'https://maketplace-prod.vercel.app',
        },
    },
    STORAGE: {
        PRODUCTBUCKETNAME: 'medii-${self:provider.stage}-products-bucket',
        PRODUCTBUCKETARN: {
            'Fn::ImportValue': '${self:provider.stage}-PRODUCT-BUCKET-ARN',
        },
        LISTINGSBUCKETNAME: 'medii-${self:provider.stage}-listings-bucket',
        LISTINGSBUCKETARN: {
            'Fn::ImportValue': '${self:provider.stage}-LISTINGS-BUCKET-ARN',
        },
    },
};
//# sourceMappingURL=shared-custom-config.js.map