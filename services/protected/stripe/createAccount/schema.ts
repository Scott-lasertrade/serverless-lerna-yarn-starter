export default {
    type: 'object',
    properties: {
        user: { type: 'object' },
        accountId: { type: 'number' },
        address: { type: 'object' },
    },
    required: ['user', 'accountId'],
} as const;
