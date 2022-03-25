export default {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string', minLength: 2, maxLength: 64 },
        parentId: { type: 'number' },
    },
    required: ['name'],
} as const;
