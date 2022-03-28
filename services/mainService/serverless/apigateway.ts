const APIGWResources = {
    SharedApiGateway: {
        Type: 'AWS::ApiGateway::RestApi',
        Properties: {
            Name: '${self:service}-${self:provider.stage}',
        },
    },
};
export default APIGWResources;
