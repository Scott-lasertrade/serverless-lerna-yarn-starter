export declare const BaseServiceName = "marketplace-backend";
export declare const SharedConfig: {
    enterprise: {
        collectLambdaLogs: boolean;
    };
    TRANSVIRTUAL: {
        prod: string;
        dev: string;
        offline: {
            APIKEY: string;
            CUSTOMER_CODE: string;
        };
    };
    OFFER: {
        DEFAULT_EXPIRY: {
            offline: number;
            dev: number;
            prod: number;
        };
    };
    STRIPE: {
        prod: string;
        dev: string;
        offline: {
            SECRETKEY: string;
            PUBLISHABLEKEY: string;
            CLIENTID: string;
            WEBHOOK: string;
        };
    };
    AURORA: {
        ARN: {
            'Fn::ImportValue': string;
        };
        SECRET_ARN: {
            'Fn::ImportValue': string;
        };
        VPC_CIDR: number;
        DB_NAME: string;
        AUTOPAUSE: {
            prod: boolean;
            dev: boolean;
            offline: boolean;
        };
    };
    API: {
        ID: {
            'Fn::ImportValue': string;
        };
        ROOT: {
            'Fn::ImportValue': string;
        };
        ADMIN: {
            'Fn::ImportValue': string;
        };
    };
    COGNITO: {
        USERPOOLNAME: {
            offline: string;
            dev: string;
            prod: string;
        };
        USERPOOLID: {
            offline: string;
            dev: {
                'Fn::ImportValue': string;
            };
            prod: {
                'Fn::ImportValue': string;
            };
        };
        IDENTITYPOOLID: {
            offline: string;
            dev: {
                'Fn::ImportValue': string;
            };
            prod: {
                'Fn::ImportValue': string;
            };
        };
        USERPOOLCLIENTID: {
            'Fn::ImportValue': string;
        };
        REGION: {
            'Fn::ImportValue': string;
        };
        OAUTHDOMAIN: {
            'Fn::ImportValue': string;
        };
        IDENTITYPOOLNAME: {
            offline: string;
            dev: string;
            prod: string;
        };
        DOMAINNAME: {
            offline: string;
            dev: string;
            prod: string;
        };
        CALLBACKURLS: {
            offline: string[];
            dev: string[];
            prod: string[];
        };
        LOGOUTURLS: {
            offline: string[];
            dev: string[];
            prod: string[];
        };
        HOSTEDDOMAIN: {
            offline: string;
            dev: string;
            prod: string;
        };
    };
    STORAGE: {
        PRODUCTBUCKETNAME: string;
        PRODUCTBUCKETARN: {
            'Fn::ImportValue': string;
        };
        LISTINGSBUCKETNAME: string;
        LISTINGSBUCKETARN: {
            'Fn::ImportValue': string;
        };
    };
};
//# sourceMappingURL=shared-custom-config.d.ts.map