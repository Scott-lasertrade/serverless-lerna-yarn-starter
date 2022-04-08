export default {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 2, maxLength: 64 },
    },
    required: ['name'],
} as const;
