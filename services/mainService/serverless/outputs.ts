const Outputs = {
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
};
export default Outputs;
