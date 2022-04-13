export default {
    type: 'object',
    properties: {
        searchTerm: { type: 'string' },
        categoryKey: { type: 'string' },
        manufacturer: { type: 'string' },
        min: { type: 'number' },
        max: { type: 'number' },
        outOfStock: { type: 'boolean' },
        orderBy: { type: 'string' },
        orderDescending: { type: 'boolean' },
        lastId: { type: 'number' },
        previousPage: { type: 'boolean' },
        limit: { type: 'number' },
    },
} as const;
