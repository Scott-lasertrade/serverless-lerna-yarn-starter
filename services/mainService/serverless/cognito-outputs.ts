const CognitoOutputs = {
    AuthUserPoolId: {
        Description: 'The Cognito User Pool',
        Value: { Ref: 'CognitoUserPoolHandel' },
        Export: {
            Name: 'COGNITO-USER-POOL',
        },
    },
    AuthIdentityPoolId: {
        Description: 'The Cognito Identity Pool',
        Value: { Ref: 'IdentityPool' },
        Export: {
            Name: 'COGNITO-IDENTITY-POOL',
        },
    },
    AuthUserPoolWebClientId: {
        Description: 'The Cognito User Pool Client',
        Value: { Ref: 'CognitoUserPoolClient' },
        Export: {
            Name: 'COGNITO-USER-POOL-CLIENT',
        },
    },
    AuthRegion: {
        Description: 'The Cognito User Pool Region',
        Value: {
            Ref: 'AWS::Region',
        },
        Export: {
            Name: 'COGNITO-REGION',
        },
    },
    AuthOauthDomain: {
        Description: 'The Cognito OAuth Domain',
        Value: {
            'Fn::Join': [
                '.',
                [
                    { Ref: 'CognitoUserPoolDomain' },
                    {
                        'Fn::Sub': 'auth.${AWS::Region}.amazoncognito.com',
                    },
                ],
            ],
        },
        Export: {
            Name: 'COGNITO-DOMAIN',
        },
    },
};
export default CognitoOutputs;
