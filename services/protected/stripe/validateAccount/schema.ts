export default {
    type: 'object',
    properties: {
        stripeAccountId: { type: 'string' },
    },
    required: ['stripeAccountId'],
} as const;
