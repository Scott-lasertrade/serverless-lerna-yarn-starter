export default {
    type: 'object',
    properties: {
        key: { type: 'string' },
        bucket: { type: 'string' },
        region: { type: 'string' },
    },
    required: ['key', 'bucket', 'region'],
} as const;
