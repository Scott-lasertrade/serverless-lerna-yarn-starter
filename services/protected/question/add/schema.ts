export default {
    type: 'object',
    properties: {
        account_id: { type: 'number' },
        listing_id: { type: 'number' },
        text: { type: 'string' },
    },
    required: ['account_id', 'listing_id', 'text'],
} as const;
