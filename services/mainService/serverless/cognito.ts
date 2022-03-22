const CognitoResources = {
  SNSRole: {
    Type: "AWS::IAM::Role",
    Properties: {
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: ["cognito-idp.amazonaws.com"],
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyName: "CognitoSNSPolicy",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: "sns:publish",
                Resource: "*",
              },
            ],
          },
        },
      ],
    },
  },
  CognitoUserPoolHandel: {
    Type: "AWS::Cognito::UserPool",
    Properties: {
      AccountRecoverySetting: {
        RecoveryMechanisms: [
          {
            Name: "verified_email",
            Priority: 1,
          },
          {
            Name: "verified_phone_number",
            Priority: 2,
          },
        ],
      },
      UserPoolName:
        "${self:custom.COGNITO.USERPOOLNAME.${self:provider.stage}}",
      UsernameAttributes: ["email"],
      AutoVerifiedAttributes: ["email", "phone_number"],
      EnabledMfas: ["SOFTWARE_TOKEN_MFA", "SMS_MFA"],
      MfaConfiguration: "OPTIONAL",
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: false,
        InviteMessageTemplate: {
          EmailMessage:
            "Your Handel.co username is {username} and temporary password is {####}.",
          EmailSubject: "Your temporary Handel.co password",
          SMSMessage:
            "Your Handel.co username is {username} and temporary password is {####}.",
        },
      },
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          RequireLowercase: true,
          RequireNumbers: true,
          RequireUppercase: true,
          RequireSymbols: false,
          TemporaryPasswordValidityDays: 7,
        },
      },
      Schema: [
        {
          Name: "email",
          Required: true,
          Mutable: true,
        },
        {
          Name: "phone_number",
          Required: false,
          Mutable: true,
        },
      ],
      EmailVerificationSubject: "Verify your account",
      EmailVerificationMessage:
        "Activate your account by following the link: {####}.",
      SmsConfiguration: {
        ExternalId:
          "${self:custom.COGNITO.USERPOOLNAME.${self:provider.stage}}-external",
        SnsCallerArn: {
          "Fn::GetAtt": ["SNSRole", "Arn"],
        },
      },
      SmsAuthenticationMessage: "Your account authentication code is {####}",
    },
  },
  CognitoUserPoolDomain: {
    Type: "AWS::Cognito::UserPoolDomain",
    Properties: {
      Domain: "${self:custom.COGNITO.DOMAINNAME.${self:provider.stage}}",
      UserPoolId: {
        Ref: "CognitoUserPoolHandel",
      },
    },
  },

  CognitoUserPoolClient: {
    Type: "AWS::Cognito::UserPoolClient",
    DependsOn: ["FacebookIdentityProvider", "GoogleIdentityProvider"],
    Properties: {
      AllowedOAuthFlows: ["code"],
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthScopes: [
        "phone",
        "email",
        "openid",
        "profile",
        "aws.cognito.signin.user.admin",
      ],
      CallbackURLs:
        "${self:custom.COGNITO.CALLBACKURLS.${self:provider.stage}}",
      LogoutURLs: "${self:custom.COGNITO.LOGOUTURLS.${self:provider.stage}}",
      ClientName: "${self:provider.stage}-web-client",
      GenerateSecret: false,
      SupportedIdentityProviders: ["COGNITO", "Facebook", "Google"],
      UserPoolId: {
        Ref: "CognitoUserPoolHandel",
      },
    },
  },

  CognitoAdminUserGroup: {
    Type: "AWS::Cognito::UserPoolGroup",
    Properties: {
      GroupName: "adminUser",
      UserPoolId: {
        Ref: "CognitoUserPoolHandel",
      },
      Precedence: 1,
      RoleArn: {
        "Fn::GetAtt": ["CognitoAdminUserRole", "Arn"],
      },
    },
  },

  FacebookIdentityProvider: {
    Type: "AWS::Cognito::UserPoolIdentityProvider",
    Properties: {
      UserPoolId: {
        Ref: "CognitoUserPoolHandel",
      },
      ProviderName: "Facebook",
      ProviderDetails: {
        client_id: process.env.FACEBOOKAPPID,
        client_secret: process.env.FACEBOOKSECRET,
        authorize_scopes: "public_profile,email",
      },
      ProviderType: "Facebook",
      AttributeMapping: {
        email: "email",
        first_name: "first_name",
      },
    },
  },

  GoogleIdentityProvider: {
    Type: "AWS::Cognito::UserPoolIdentityProvider",
    Properties: {
      UserPoolId: {
        Ref: "CognitoUserPoolHandel",
      },
      ProviderName: "Google",
      ProviderDetails: {
        client_id: process.env.GOOGLEAPPID,
        client_secret: process.env.GOOGLESECRET,
        authorize_scopes: "profile email openid",
      },
      ProviderType: "Google",
      AttributeMapping: {
        email: "email",
        given_name: "given_name",
        email_verified: "email_verified",
      },
    },
  },

  IdentityPool: {
    Type: "AWS::Cognito::IdentityPool",
    Properties: {
      IdentityPoolName:
        "${self:custom.COGNITO.IDENTITYPOOLNAME.${self:provider.stage}}",
      AllowUnauthenticatedIdentities: true,
      CognitoIdentityProviders: [
        {
          ClientId: {
            Ref: "CognitoUserPoolClient",
          },
          ProviderName: {
            "Fn::GetAtt": ["CognitoUserPoolHandel", "ProviderName"],
          },
        },
      ],
      SupportedLoginProviders: {
        "graph.facebook.com":
          "${self:custom.COGNITO.SECRET.${self:provider.stage}.FACEBOOKAPPID}",
        "accounts.google.com":
          "${self:custom.COGNITO.SECRET.${self:provider.stage}.GOOGLEAPPID}",
      },
    },
  },

  CognitoUnAuthorizedRole: {
    Type: "AWS::IAM::Role",
    Properties: {
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: "cognito-identity.amazonaws.com",
            },
            Action: ["sts:AssumeRoleWithWebIdentity"],
            Condition: {
              StringEquals: {
                "cognito-identity.amazonaws.com:aud": {
                  Ref: "IdentityPool",
                },
              },
              "ForAnyValue:StringLike": {
                "cognito-identity.amazonaws.com:amr": "unauthenticated",
              },
            },
          },
        ],
      },
      Policies: [
        {
          PolicyName: "CognitoUnauthorizedPolicy",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: ["execute-api:Invoke"],
                Resource: [
                  {
                    "Fn::Join": [
                      "/",
                      [
                        {
                          "Fn::Join": [
                            ":",
                            [
                              "arn:aws:execute-api",
                              {
                                Ref: "AWS::Region",
                              },
                              {
                                Ref: "AWS::AccountId",
                              },
                              "${self:custom.API.ID}",
                            ],
                          ],
                        },
                        {
                          "Fn::Sub": "${self:provider.stage}/*/public/*",
                        },
                      ],
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },

  CognitoAuthorizedRole: {
    Type: "AWS::IAM::Role",
    Properties: {
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: "cognito-identity.amazonaws.com",
            },
            Action: ["sts:AssumeRoleWithWebIdentity"],
            Condition: {
              StringEquals: {
                "cognito-identity.amazonaws.com:aud": {
                  Ref: "IdentityPool",
                },
              },
              "ForAnyValue:StringLike": {
                "cognito-identity.amazonaws.com:amr": "authenticated",
              },
            },
          },
        ],
      },
      Policies: [
        {
          PolicyName: "CognitoAuthorizedPolicy",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "mobileanalytics:PutEvents",
                  "cognito-sync:*",
                  "cognito-identity:*",
                ],
                Resource: ["*"],
              },
              {
                Effect: "Allow",
                Action: ["execute-api:Invoke"],
                Resource: [
                  {
                    "Fn::Join": [
                      "/",
                      [
                        {
                          "Fn::Join": [
                            ":",
                            [
                              "arn:aws:execute-api",
                              {
                                Ref: "AWS::Region",
                              },
                              {
                                Ref: "AWS::AccountId",
                              },
                              "${self:custom.API.ID}",
                            ],
                          ],
                        },
                        {
                          "Fn::Sub": "${self:provider.stage}/*/protected/*",
                        },
                      ],
                    ],
                  },
                  {
                    "Fn::Join": [
                      "/",
                      [
                        {
                          "Fn::Join": [
                            ":",
                            [
                              "arn:aws:execute-api",
                              {
                                Ref: "AWS::Region",
                              },
                              {
                                Ref: "AWS::AccountId",
                              },
                              "${self:custom.API.ID}",
                            ],
                          ],
                        },
                        {
                          "Fn::Sub": "${self:provider.stage}/*/public/*",
                        },
                      ],
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },

  CognitoAdminUserRole: {
    Type: "AWS::IAM::Role",
    Properties: {
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: "cognito-identity.amazonaws.com",
            },
            Action: ["sts:AssumeRoleWithWebIdentity"],
            Condition: {
              StringEquals: {
                "cognito-identity.amazonaws.com:aud": {
                  Ref: "IdentityPool",
                },
              },
              "ForAnyValue:StringLike": {
                "cognito-identity.amazonaws.com:amr": "authenticated",
              },
            },
          },
        ],
      },
      Policies: [
        {
          PolicyName: "CognitoAdminUserPolicy",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "mobileanalytics:PutEvents",
                  "cognito-sync:*",
                  "cognito-identity:*",
                ],
                Resource: ["*"],
              },
              {
                Effect: "Allow",
                Action: ["execute-api:Invoke"],
                Resource: [
                  {
                    "Fn::Join": [
                      "/",
                      [
                        {
                          "Fn::Join": [
                            ":",
                            [
                              "arn:aws:execute-api",
                              {
                                Ref: "AWS::Region",
                              },
                              {
                                Ref: "AWS::AccountId",
                              },
                              "${self:custom.API.ID}",
                            ],
                          ],
                        },
                        {
                          "Fn::Sub": "${self:provider.stage}/*/admin/*",
                        },
                      ],
                    ],
                  },
                  {
                    "Fn::Join": [
                      "/",
                      [
                        {
                          "Fn::Join": [
                            ":",
                            [
                              "arn:aws:execute-api",
                              {
                                Ref: "AWS::Region",
                              },
                              {
                                Ref: "AWS::AccountId",
                              },
                              "${self:custom.API.ID}",
                            ],
                          ],
                        },
                        {
                          "Fn::Sub": "${self:provider.stage}/*/protected/*",
                        },
                      ],
                    ],
                  },
                  {
                    "Fn::Join": [
                      "/",
                      [
                        {
                          "Fn::Join": [
                            ":",
                            [
                              "arn:aws:execute-api",
                              {
                                Ref: "AWS::Region",
                              },
                              {
                                Ref: "AWS::AccountId",
                              },
                              "${self:custom.API.ID}",
                            ],
                          ],
                        },
                        {
                          "Fn::Sub": "${self:provider.stage}/*/public/*",
                        },
                      ],
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },

  IdentityPoolRoleMapping: {
    Type: "AWS::Cognito::IdentityPoolRoleAttachment",
    Properties: {
      IdentityPoolId: {
        Ref: "IdentityPool",
      },
      Roles: {
        authenticated: {
          "Fn::GetAtt": ["CognitoAuthorizedRole", "Arn"],
        },
        unauthenticated: {
          "Fn::GetAtt": ["CognitoUnAuthorizedRole", "Arn"],
        },
      },
      RoleMappings: {
        CognitoMapping: {
          IdentityProvider: {
            "Fn::Join": [
              "",
              [
                "cognito-idp.",
                {
                  Ref: "AWS::Region",
                },
                ".amazonaws.com/",
                {
                  Ref: "CognitoUserPoolHandel",
                },
                ":",
                {
                  Ref: "CognitoUserPoolClient",
                },
              ],
            ],
          },
          AmbiguousRoleResolution: "AuthenticatedRole",
          Type: "Token",
        },
      },
    },
  },
};
export default CognitoResources;
