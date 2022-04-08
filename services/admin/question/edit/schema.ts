export default {
    type: 'object',
    properties: {
        version: { type: 'number' },
        question: { type: 'string' },
        answer: { type: 'string' },
    },
    required: ['version'],
} as const;
