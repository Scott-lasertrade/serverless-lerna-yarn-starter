export const BaseServiceName = 'marketplace-backend';
export const SharedConfig = {
    enterprise: {
        collectLambdaLogs: false,
    },
    // TRANSVIRTUAL: {
    //     prod: '${ssm:/aws/reference/secretsmanager/prod/transvirtual}',
    //     dev: '${ssm:/aws/reference/secretsmanager/dev/transvirtual}',
    //     offline: {
    //         APIKEY: '78746|YRMKTSNZZP',
    //         CUSTOMER_CODE: 'LASRTECH',
    //     },
    // },
    // HUBSPOT: {
    //     prod: '${ssm:/aws/reference/secretsmanager/prod/hubspot}',
    //     dev: '${ssm:/aws/reference/secretsmanager/dev/hubspot}',
    //     offline: {
    //         HAPIKEY: '839d9ef7-0f0a-4c05-b19d-cc22e92882ac',
    //     },
    // },
    OFFER: {
        DEFAULT_EXPIRY: {
            offline: 1 * 60 * 1000, // 1 Minute
            dev: 30 * 60 * 1000, // 30 Minutes
            prod: 72 * 60 * 60 * 1000, // 72 hours
        },
    },
    // STRIPE: {
    //     prod: '${ssm:/aws/reference/secretsmanager/prod/stripe}',
    //     dev: '${ssm:/aws/reference/secretsmanager/dev/stripe}',
    //     offline: {
    //         SECRETKEY:
    //             'sk_test_51HINWDDpQDarlqIHMzsLZ8kHsv8Onk2ReTy8PvJ5rbmG9mqTmXAheYcdVXMDtIHVVFO4Io6sgZEHRe1gM8NLoHjU00wpnl0GX7',
    //         PUBLISHABLEKEY:
    //             'pk_test_51HINWDDpQDarlqIHPyO2gQGWoTQb8OHDhdu32voQIa7ZAbE2nePE3neA21B6o7kqJMNnAlw4TazZlwSSTaaRTwkl00jzIAZGwO',
    //         CLIENTID: 'ca_KZA5qFeOZRXYelvz9XklgtD1PgDuRZWZ',
    //         WEBHOOK:
    //             'whsec_83f6b3e47b2deaaf94d672861150ce1a9fac74e4caa6e7214d0dc5b6ec0b6201',
    //     },
    // },

    AURORA: {
        ARN: {
            'Fn::ImportValue': 'AURORA-ARN',
        },
        SECRET_ARN: {
            'Fn::ImportValue': 'AURORA-SECRET-ARN',
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
            'Fn::ImportValue': 'SHARED-API-ID',
        },
        ROOT: {
            'Fn::ImportValue': 'SHARED-API-ROOT',
        },
    },
    COGNITO: {
        USERPOOLNAME: {
            offline: 'marketplace-backend-dev',
            dev: 'marketplace-backend-${self:provider.stage}',
            prod: 'marketplace-backend-${self:provider.stage}',
        },
        USERPOOLID: {
            offline: 'ap-southeast-2_1q0PND3QW',
            dev: { 'Fn::ImportValue': 'COGNITO-USER-POOL' },
            prod: { 'Fn::ImportValue': 'COGNITO-USER-POOL' },
        },
        IDENTITYPOOLID: {
            offline: 'TODO - VALUE',
            dev: { 'Fn::ImportValue': 'COGNITO-IDENTITY-POOL' },
            prod: { 'Fn::ImportValue': 'COGNITO-IDENTITY-POOL' },
        },
        USERPOOLCLIENTID: {
            'Fn::ImportValue': 'COGNITO-USER-POOL-CLIENT',
        },
        REGION: {
            'Fn::ImportValue': 'COGNITO-REGION',
        },
        OAUTHDOMAIN: {
            'Fn::ImportValue': 'COGNITO-DOMAIN',
        },
        IDENTITYPOOLNAME: {
            offline: 'marketplace-backend-dev',
            dev: 'marketplace-backend-${self:provider.stage}',
            prod: 'marketplace-backend-${self:provider.stage}',
        },
        DOMAINNAME: {
            offline: 'marketplace-backend-dev',
            dev: 'marketplace-backend-${self:provider.stage}',
            prod: 'marketplace-backend-${self:provider.stage}',
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
        PRODUCTBUCKETNAME:
            'marketplace-backend-${self:provider.stage}-products-bucket',
        PRODUCTBUCKETARN: {
            'Fn::ImportValue': 'PRODUCT-BUCKET-ARN',
        },
        LISTINGSBUCKETNAME:
            'marketplace-backend-${self:provider.stage}-listings-bucket',
        LISTINGSBUCKETARN: {
            'Fn::ImportValue': 'LISTINGS-BUCKET-ARN',
        },
    },
};