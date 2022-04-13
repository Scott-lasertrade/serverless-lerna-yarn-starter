export default {
    type: 'object',
    properties: {
        emailAddress: { type: 'string' },
        firstName: { type: 'string' },
    },
    required: ['emailAddress', 'firstName'],
} as const;
