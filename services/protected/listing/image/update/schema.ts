export default {
    type: 'object',
    properties: {
        imagesList: {
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'object',
                properties: {
                    id: { type: ['string', 'number'] },
                    bucket: { type: 'string' },
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
                    updated: { type: 'boolean' },
                },
            },
        },
    },
    required: ['imagesList'],
} as const;
