import { handlerPath } from '@medii/api-lambda';
import { UserpoolTriggers } from 'UserpoolTriggers';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 10,
    versionFunction: false,
    events: [
        {
            cognitoUserPool: {
                pool: '${self:custom.COGNITO.USERPOOLNAME.${self:provider.stage}}',
                trigger: UserpoolTriggers.CustomMessage,
                existing: true,
            },
        },
    ],
    environment: {
        HOSTING_DOMAIN:
            '${self:custom.COGNITO.HOSTEDDOMAIN.${self:provider.stage}}',
    },
};
