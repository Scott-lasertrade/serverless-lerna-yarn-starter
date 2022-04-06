import { handlerPath } from '@medii/api-lambda';
import { UserpoolTriggers } from '@medii/common';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            cognitoUserPool: {
                pool: '${self:custom.COGNITO.USERPOOLNAME.${self:provider.stage}}',
                trigger: UserpoolTriggers.PreTokenGeneration,
                existing: true,
            },
        },
    ],
};
