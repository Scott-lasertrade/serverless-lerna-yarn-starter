export default {
    type: 'object',
    properties: {
        userId: { type: 'string' },
        suspend: { type: 'boolean' },
    },
    required: ['userId', 'suspend'],
} as const;
