const APIGWOutputs = {
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
            'Fn::GetAtt': ['SharedApiGateway', 'RootResourceId'],
        },
        Export: {
            Name: 'SHARED-API-ROOT',
        },
    },
    ApiGatewayAdminResourceId: {
        Description: 'Shared ApiGateway admin resource Id',
        Value: {
            Ref: 'AdminPartPath',
        },
        Export: {
            Name: 'ADMIN-API-ROOT',
        },
    },
};
export default APIGWOutputs;
