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
};
export default APIGWResources;
