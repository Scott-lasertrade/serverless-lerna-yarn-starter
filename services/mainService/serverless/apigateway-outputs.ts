const APIGWOutputs = {
    ApiGatewayRestApiId: {
        Description: 'Shared ApiGateway Id',
        Value: {
            Ref: 'SharedApiGateway',
        },
        Export: {
            Name: '${self:provider.stage}-SHARED-API-ID',
        },
    },
    ApiGatewayRestApiRootResourceId: {
        Description: 'Shared ApiGateway root resource Id',
        Value: {
            'Fn::GetAtt': ['SharedApiGateway', 'RootResourceId'],
        },
        Export: {
            Name: '${self:provider.stage}-SHARED-API-ROOT',
        },
    },
    ApiGatewayAdminResourceId: {
        Description: 'Shared ApiGateway admin resource Id',
        Value: {
            Ref: 'AdminPartPath',
        },
        Export: {
            Name: '${self:provider.stage}-ADMIN-API-ROOT',
        },
    },
    ApiGatewayProtectedResourceId: {
        Description: 'Shared ApiGateway protected resource Id',
        Value: {
            Ref: 'ProtectedPartPath',
        },
        Export: {
            Name: '${self:provider.stage}-PROTECTED-API-ROOT',
        },
    },
    ApiGatewayPublicResourceId: {
        Description: 'Shared ApiGateway public resource Id',
        Value: {
            Ref: 'PublicPartPath',
        },
        Export: {
            Name: '${self:provider.stage}-PUBLIC-API-ROOT',
        },
    },
    ApiGatewayCustomRequestValidator: {
        Description: 'Shared ApiGateway request validator Id',
        Value: {
            Ref: 'CustomRequestValidator',
        },
        Export: {
            Name: '${self:provider.stage}-API-REQUEST-VALIDATOR',
        },
    },
};
export default APIGWOutputs;
