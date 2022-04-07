const StorageOutputs = {
    ProductsBucketARN: {
        Description: 'The products bucket ARN',
        Value: {
            'Fn::GetAtt': ['ProductsBucket', 'Arn'],
        },
        Export: {
            Name: '${self:provider.stage}-PRODUCT-BUCKET-ARN',
        },
    },
    ListingsBucketARN: {
        Description: 'The listings bucket ARN',
        Value: {
            'Fn::GetAtt': ['ListingsBucket', 'Arn'],
        },
        Export: {
            Name: '${self:provider.stage}-LISTINGS-BUCKET-ARN',
        },
    },
};
export default StorageOutputs;
