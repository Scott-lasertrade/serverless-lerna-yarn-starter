export default {
    type: 'object',
    properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phoneNumber: { type: 'string' },
        accountType: { type: 'string' },
        businessPhoneNumber: { type: 'string' },
        taxId: { type: 'string' },
        businessName: { type: 'string' },
        legalName: { type: 'string' },
    },
    required: ['accountType'],
} as const;
