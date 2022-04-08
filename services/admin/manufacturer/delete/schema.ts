export default {
    type: 'object',
    properties: {
        id: { type: 'number', minimum: 1 },
        version: { type: 'number', minimum: 1 },
    },
    required: ['id', 'version'],
} as const;
