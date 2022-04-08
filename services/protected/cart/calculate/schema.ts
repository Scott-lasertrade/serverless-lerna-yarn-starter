export default {
    type: 'object',
    properties: {
        address: {
            type: 'object',
            properties: {
                suburb: { type: 'string' },
                state: { type: 'string' },
                postcode: { type: 'string' },
                country: { type: 'string' },
            },
        },
    },
} as const;
