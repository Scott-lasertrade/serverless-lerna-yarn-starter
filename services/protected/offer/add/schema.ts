export default {
    type: 'object',
    properties: {
        account_id: { type: 'number' },
        listing_id: { type: 'number' },
        value: { type: 'number' },
        expire_on: { type: 'string', format: 'date-time' },
    },
    required: ['listing_id', 'account_id'],
} as const;
