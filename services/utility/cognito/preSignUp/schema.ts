export default {
    type: 'object',
    properties: {
        userName: { type: 'string' },
        region: { type: 'string' },
        email: { type: 'string' },
        request: { type: 'object' },
        callerContext: { type: 'object' },
        triggerSource: { type: 'string' },
        response: { type: 'object' },
    },
    required: ['userName'],
} as const;
