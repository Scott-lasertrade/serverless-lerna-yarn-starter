export default {
    type: 'object',
    properties: {
        value: { type: 'number' },
        version: { type: 'number' },
        expire_on: { type: 'string' },
    },
    required: ['value', 'version'],
} as const;
