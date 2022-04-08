export default {
    type: 'object',
    properties: {
        orderAbn: { type: 'string' },
        orderBusinessName: { type: 'string' },
        orderAddress: {
            type: 'object',
            properties: {
                addressLine1: { type: 'string' },
                addressLine2: { type: 'string' },
                suburb: { type: 'string' },
                state: { type: 'string' },
                postcode: { type: 'string' },
                country: { type: 'string' },
            },
        },
        listingAddress: {
            type: 'object',
            properties: {
                addressLine1: { type: 'string' },
                addressLine2: { type: 'string' },
                suburb: { type: 'string' },
                state: { type: 'string' },
                postcode: { type: 'string' },
                country: { type: 'string' },
            },
        },
        shippingFee: { type: 'number' },
        includeGST: { type: 'boolean' },
    },
    required: ['includeGST'],
} as const;
