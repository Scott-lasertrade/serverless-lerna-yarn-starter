export default {
    type: 'object',
    properties: {
        account_id: { type: 'number' },
        listing_id: { type: 'number' },
    },
    required: ['listing_id', 'account_id'],
} as const;
