export default {
    type: 'object',
    properties: {
        post_code: { type: 'string' },
        address_line_1: { type: 'string' },
        address_line_2: { type: 'string' },
        state: { type: 'string' },
        city: { type: 'string' },
        country: { type: 'number' },
        suburb: { type: 'string' },
        tax_id: { type: 'string' },
        business_name: { type: 'string' },
        address_id: { type: 'number' },
        account_id: { type: 'number' },
    },
} as const;
