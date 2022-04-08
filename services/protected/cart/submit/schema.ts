export default {
    type: 'object',
    properties: {
        id: { type: 'number' },
        buyerDetails: {
            type: 'object',
            properties: {
                fName: { type: 'string' },
                lName: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                bName: { type: 'string' },
                taxId: { type: 'string' },
            },
        },
        address: {
            type: 'object',
            properties: {
                line1: { type: 'string' },
                line2: { type: 'string' },
                suburb: { type: 'string' },
                state: { type: 'string' },
                postcode: { type: 'string' },
                country: { type: 'string' },
            },
        },
    },
    required: ['buyerDetails', 'address'],
} as const;
