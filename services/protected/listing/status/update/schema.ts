export default {
    type: 'object',
    properties: {
        id: { type: 'number' },
        version: { type: 'number' },
        status: { type: 'string' },
        reason: { type: 'string' },
    },
    required: ['id', 'version', 'status'],
} as const;
