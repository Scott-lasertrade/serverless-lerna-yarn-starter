export default {
    type: 'object',
    properties: {
        buyerId: { type: 'number' },
    },
    required: ['buyerId'],
} as const;
