export default {
    type: 'object',
    properties: {
        id: { type: 'number', minimum: 1 },
        version: { type: 'number', minimum: 1 },
        dimensionsId: { type: 'number', minimum: 1 },
        usageTypeId: { type: 'number', minimum: 1 },
        productTypeId: { type: 'number', minimum: 1 },
        name: { type: 'string', minLength: 2, maxLength: 64 },
        description: { type: 'string' },
        specification: { type: 'string' },
        connections: {
            type: 'array',
            items: {
                type: 'number',
            },
        },
        isActive: { type: 'boolean' },
        isDraft: { type: 'boolean' },
        manufacturers: {
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'object',
                properties: {
                    key: { type: 'string' },
                    value: { type: 'string' },
                },
            },
        },
        categories: {
            type: 'array',
            items: {
                type: 'number',
            },
        },
        productImages: {
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'object',
                properties: {
                    id: { type: ['string', 'number'] },
                    bucket: { type: 'string' },
                    key: { type: 'string' },
                    region: { type: 'string' },
                    order: { type: 'number' },
                    image: { type: 'string' },
                    mime: {
                        enum: [
                            'image/jpeg',
                            'image/jpg',
                            'image/png',
                            'image/jsp',
                        ],
                    },
                },
            },
        },
        weight: { type: 'number' },
        length: { type: 'number' },
        width: { type: 'number' },
        height: { type: 'number' },
    },
    required: ['name', 'productTypeId'],
} as const;
