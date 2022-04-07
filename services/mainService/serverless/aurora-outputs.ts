const AuroraOutputs = {
    AuroraClusterARN: {
        Description: 'The aurora database ARN',
        Value: {
            'Fn::Sub':
                'arn:${AWS::Partition}:rds:${AWS::Region}:${AWS::AccountId}:cluster:${AuroraRDSCluster}',
        },
        Export: {
            Name: '${self:provider.stage}-AURORA-ARN',
        },
    },
    AuroraClusterSecretARN: {
        Description: 'The aurora database secret ARN',
        Value: {
            Ref: 'AuroraAdminSecret',
        },
        Export: {
            Name: '${self:provider.stage}-AURORA-SECRET-ARN',
        },
    },
};
export default AuroraOutputs;
