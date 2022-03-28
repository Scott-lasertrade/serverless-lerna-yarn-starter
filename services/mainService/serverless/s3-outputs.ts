const StorageOutputs = {
    ProductsBucketARN: {
        Description: 'The products bucket ARN',
        Value: {
            'Fn::GetAtt': ['ProductsBucket', 'Arn'],
        },
        Export: {
            Name: 'PRODUCT-BUCKET-ARN',
        },
    },
    ListingsBucketARN: {
        Description: 'The listings bucket ARN',
        Value: {
            'Fn::GetAtt': ['ListingsBucket', 'Arn'],
        },
        Export: {
            Name: 'LISTINGS-BUCKET-ARN',
        },
    },
};
export default StorageOutputs;
