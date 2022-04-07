const AuroraResources = {
    AuroraAdminSecret: {
        Type: 'AWS::SecretsManager::Secret',
        Properties: {
            Description: 'Dynamically generate a secret password.',
            GenerateSecretString: {
                SecretStringTemplate: '{"username": "marketplaceapi"}',
                GenerateStringKey: 'password',
                PasswordLength: 30,
                ExcludeCharacters: '"@/\\',
            },
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
        },
    },

    AuroraRDSCluster: {
        Type: 'AWS::RDS::DBCluster',
        Properties: {
            BackupRetentionPeriod: 3,
            DatabaseName: '${self:custom.AURORA.DB_NAME}',
            DBClusterParameterGroupName: {
                Ref: 'AuroraDBClusterParameterGroup',
            },
            DBSubnetGroupName: {
                Ref: 'AuroraDBSubnetGroup',
            },
            DeletionProtection: false,
            EnableHttpEndpoint: true,
            Engine: 'aurora-postgresql',
            EngineMode: 'serverless',
            EngineVersion: '10.14',
            KmsKeyId: {
                Ref: 'AuroraKMSKey',
            },
            MasterUsername: {
                'Fn::Sub':
                    '{{resolve:secretsmanager:${AuroraAdminSecret}::username}}',
            },
            MasterUserPassword: {
                'Fn::Sub':
                    '{{resolve:secretsmanager:${AuroraAdminSecret}::password}}',
            },
            PreferredMaintenanceWindow: 'Sun:12:00-Sun:12:30',
            ScalingConfiguration: {
                AutoPause:
                    '${self:custom.AURORA.AUTOPAUSE.${self:provider.stage}}',
                MinCapacity: 2,
                MaxCapacity: 4,
                SecondsUntilAutoPause: 600,
            },
            StorageEncrypted: true,
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
            VpcSecurityGroupIds: [
                {
                    Ref: 'AuroraVPCSecurityGroup',
                },
            ],
        },
    },

    SecretRDSInstanceAttachment: {
        Type: 'AWS::SecretsManager::SecretTargetAttachment',
        Properties: {
            SecretId: {
                Ref: 'AuroraAdminSecret',
            },
            TargetId: {
                Ref: 'AuroraRDSCluster',
            },
            TargetType: 'AWS::RDS::DBCluster',
        },
    },

    AuroraDBClusterParameterGroup: {
        Type: 'AWS::RDS::DBClusterParameterGroup',
        Properties: {
            Description: 'Aurora Cluster Parameter Group',
            Family: 'aurora-postgresql10',
            Parameters: {
                timezone: 'Australia/Sydney',
            },
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
        },
    },

    AuroraDBSubnetGroup: {
        Type: 'AWS::RDS::DBSubnetGroup',
        Properties: {
            DBSubnetGroupDescription: 'Aurora DB Subnet Group',
            DBSubnetGroupName: '${self:provider.stage}-aurora-dbsubnet-group',
            SubnetIds: [
                { Ref: 'AuroraDBSubnetA' },
                { Ref: 'AuroraDBSubnetB' },
                { Ref: 'AuroraDBSubnetC' },
            ],
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
        },
    },

    AuroraDBSubnetA: {
        DependsOn: ['AuroraVPC'],
        Type: 'AWS::EC2::Subnet',
        Properties: {
            AvailabilityZone: '${self:provider.region}a',
            CidrBlock: '${self:custom.AURORA.VPC_CIDR}.0.0.0/24',
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
            VpcId: {
                Ref: 'AuroraVPC',
            },
        },
    },

    AuroraDBSubnetB: {
        DependsOn: ['AuroraVPC'],
        Type: 'AWS::EC2::Subnet',
        Properties: {
            AvailabilityZone: '${self:provider.region}b',
            CidrBlock: '${self:custom.AURORA.VPC_CIDR}.0.1.0/24',
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
            VpcId: {
                Ref: 'AuroraVPC',
            },
        },
    },

    AuroraDBSubnetC: {
        DependsOn: ['AuroraVPC'],
        Type: 'AWS::EC2::Subnet',
        Properties: {
            AvailabilityZone: '${self:provider.region}c',
            CidrBlock: '${self:custom.AURORA.VPC_CIDR}.0.2.0/24',
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
            VpcId: {
                Ref: 'AuroraVPC',
            },
        },
    },

    AuroraVPC: {
        Type: 'AWS::EC2::VPC',
        Properties: {
            CidrBlock: '${self:custom.AURORA.VPC_CIDR}.0.0.0/16',
            EnableDnsSupport: true,
            EnableDnsHostnames: true,
            InstanceTenancy: 'default',
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
        },
    },

    AuroraVPCRouteTable: {
        Type: 'AWS::EC2::RouteTable',
        Properties: {
            VpcId: {
                Ref: 'AuroraVPC',
            },
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
        },
    },

    AuroraVPCRoute: {
        Type: 'AWS::EC2::Route',
        DependsOn: ['AuroraAttachGateway'],
        Properties: {
            RouteTableId: {
                Ref: 'AuroraVPCRouteTable',
            },
            DestinationCidrBlock: '0.0.0.0/0',
            GatewayId: {
                Ref: 'AuroraInternetGateway',
            },
        },
    },

    AuroraInternetGateway: {
        Type: 'AWS::EC2::InternetGateway',
        Properties: {
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
        },
    },

    AuroraAttachGateway: {
        Type: 'AWS::EC2::VPCGatewayAttachment',
        Properties: {
            VpcId: {
                Ref: 'AuroraVPC',
            },
            InternetGatewayId: {
                Ref: 'AuroraInternetGateway',
            },
        },
    },

    AuroraVPCSecurityGroup: {
        DependsOn: ['AuroraVPC'],
        Type: 'AWS::EC2::SecurityGroup',
        Properties: {
            GroupDescription: 'Allow Postgres Inbound',
            VpcId: {
                Ref: 'AuroraVPC',
            },
            SecurityGroupIngress: [
                {
                    IpProtocol: 'tcp',
                    FromPort: '5432',
                    ToPort: '5432',
                    CidrIp: '0.0.0.0/0',
                },
            ],
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
        },
    },

    AuroraSubnetRouteTableAssociationA: {
        Type: 'AWS::EC2::SubnetRouteTableAssociation',
        Properties: {
            SubnetId: {
                Ref: 'AuroraDBSubnetA',
            },
            RouteTableId: {
                Ref: 'AuroraVPCRouteTable',
            },
        },
    },

    AuroraSubnetRouteTableAssociationB: {
        Type: 'AWS::EC2::SubnetRouteTableAssociation',
        Properties: {
            SubnetId: {
                Ref: 'AuroraDBSubnetB',
            },
            RouteTableId: {
                Ref: 'AuroraVPCRouteTable',
            },
        },
    },

    AuroraSubnetRouteTableAssociationC: {
        Type: 'AWS::EC2::SubnetRouteTableAssociation',
        Properties: {
            SubnetId: {
                Ref: 'AuroraDBSubnetC',
            },
            RouteTableId: {
                Ref: 'AuroraVPCRouteTable',
            },
        },
    },

    AuroraKMSKey: {
        Type: 'AWS::KMS::Key',
        Properties: {
            Description: 'The AWS KMS for Aurora Data Security',
            Enabled: true,
            PendingWindowInDays: 7,
            KeyPolicy: {
                Version: '2012-10-17',
                Id: 'key--handel-marketplace',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: {
                            AWS: [
                                {
                                    'Fn::Join': [
                                        ':',
                                        [
                                            'arn:aws:iam:',
                                            { Ref: 'AWS::AccountId' },
                                            'root',
                                        ],
                                    ],
                                },
                            ],
                        },
                        Action: 'kms:*',
                        Resource: '*',
                    },
                ],
            },
            Tags: [
                {
                    Key: 'Serverless',
                    Value: 'Aurora-Marketplace',
                },
            ],
        },
    },
};
export default AuroraResources;
