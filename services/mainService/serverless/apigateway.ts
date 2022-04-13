const APIGWResources = {
    SharedApiGateway: {
        Type: 'AWS::ApiGateway::RestApi',
        Properties: {
            Name: '${self:service}-${self:provider.stage}',
        },
    },
    AdminPartPath: {
        Type: 'AWS::ApiGateway::Resource',
        Properties: {
            RestApiId: {
                Ref: 'SharedApiGateway',
            },
            ParentId: {
                'Fn::GetAtt': ['SharedApiGateway', 'RootResourceId'],
            },
            PathPart: 'admin',
        },
    },
    ProtectedPartPath: {
        Type: 'AWS::ApiGateway::Resource',
        Properties: {
            RestApiId: {
                Ref: 'SharedApiGateway',
            },
            ParentId: {
                'Fn::GetAtt': ['SharedApiGateway', 'RootResourceId'],
            },
            PathPart: 'protected',
        },
    },
    PublicPartPath: {
        Type: 'AWS::ApiGateway::Resource',
        Properties: {
            RestApiId: {
                Ref: 'SharedApiGateway',
            },
            ParentId: {
                'Fn::GetAtt': ['SharedApiGateway', 'RootResourceId'],
            },
            PathPart: 'public',
        },
    },
};
export default APIGWResources;
