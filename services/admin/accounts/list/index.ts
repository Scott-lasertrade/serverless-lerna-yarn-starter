import { handlerPath } from "@shared/handlerResolver";
import { AWSFunction } from "@shared/lambda";
import { customCors } from "@shared/customCors";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 10,
  versionFunction: false,
  events: [
    {
      http: {
        method: "get",
        path: "admin/accounts/list",
        cors: customCors,
        authorizer: "aws_iam",
      },
    },
  ],
  iamRoleStatements: [
    {
      Sid: "AuroraDataAccessPolicy",
      Effect: "Allow",
      Action: ["rds-data:*"],
      Resource: ["${self:custom.AURORA.ARN}"],
    },
    {
      Sid: "AuroraSecretAccessPolicy",
      Effect: "Allow",
      Action: ["secretsmanager:GetSecretValue"],
      Resource: "${self:custom.AURORA.SECRET_ARN}",
    },
    {
      Sid: "AdminListUserPolicy",
      Effect: "Allow",
      Action: ["cognito-idp:ListUsers"],
      Resource: [
        {
          "Fn::Join": [
            ":",
            [
              "arn:aws:cognito-idp",
              {
                Ref: "AWS::Region",
              },
              {
                Ref: "AWS::AccountId",
              },
              "*",
            ],
          ],
        },
      ],
    },
  ],
  environment: {
    COGNITO_USER_POOL_ID:
      "${self:custom.COGNITO.USERPOOLID.${self:provider.stage}}",
  },
} as AWSFunction;
