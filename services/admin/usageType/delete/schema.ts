export default {
    type: 'object',
    properties: {
        id: { type: 'number', minimum: 1 },
    },
    required: ['id'],
} as const;
