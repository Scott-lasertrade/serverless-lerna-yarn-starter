export default {
    type: 'object',
    properties: {
        userId: { type: 'number' },
        buyerName: { type: 'string' },
        buyerPhone: { type: 'string' },
        buyerAddress: { type: 'string' },
        listingId: { type: 'number' },
        amount: { type: 'number' },
        domain: { type: 'string' },
    },
    required: [
        'userId',
        'buyerName',
        'buyerPhone',
        'buyerAddress',
        'listingId',
        'amount',
        'domain',
    ],
} as const;
