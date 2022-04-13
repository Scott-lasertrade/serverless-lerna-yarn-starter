export default {
    type: 'object',
    properties: {
        listing_id: { type: 'number' },
        account_id: { type: 'number' },
    },
    required: ['listing_id', 'account_id'],
} as const;
