export default {
    type: 'object',
    properties: {
        checkoutId: { type: 'number' },
    },
    required: ['checkoutId'],
} as const;
