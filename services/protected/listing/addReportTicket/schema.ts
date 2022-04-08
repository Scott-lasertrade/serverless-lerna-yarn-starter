export default {
    type: 'object',
    properties: {
        product_id: { type: 'number' },
    },
    required: ['product_id'],
} as const;
