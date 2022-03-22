const StorageResources = {
    ProductsBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
            BucketName: '${self:custom.STORAGE.PRODUCTBUCKETNAME}',
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
            VersioningConfiguration: {
                Status: 'Enabled',
            },
        },
    },
    ListingsBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
            BucketName: '${self:custom.STORAGE.LISTINGSBUCKETNAME}',
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
        },
    },
};
export default StorageResources;
