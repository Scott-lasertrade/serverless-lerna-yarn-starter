export default {
    type: 'object',
    properties: {
        version: { type: 'number' },
        text: { type: 'string' },
    },
    required: ['version', 'text'],
} as const;
