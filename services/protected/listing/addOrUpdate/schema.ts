export default {
    type: 'object',
    properties: {
        id: { type: 'number' },
        version: { type: 'number' },
        accountId: { type: 'number' },
        accountVersion: { type: 'number' },
        accountAddressId: { type: 'number' },
        accountAddressVersion: { type: 'number' },
        saveAsDefault: { type: 'boolean' },
        productId: { type: 'number' },
        productVersion: { type: 'number' },
        productName: { type: 'string' },
        productEdited: { type: 'boolean' },
        manufacturers: {
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'object',
                properties: {
                    key: { type: 'string' },
                    value: { type: 'string' },
                },
            },
        },
        serialNumber: { type: 'string' },
        YOM: { type: 'number' },
        usageTypeId: { type: 'number' },
        usageId: { type: 'number' },
        usageVersion: { type: 'number' },
        usageValue: { type: 'number' },
        comment: { type: 'string' },
        accessories: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', minimum: 1 },
                    version: { type: 'number', minimum: 1 },
                    active: { type: 'boolean' },
                    product_id: { type: 'number', minimum: 1 },
                    usage_type_id: { type: 'number', minimum: 1 },
                    usage_id: { type: 'number' },
                    usage_value: { type: 'number' },
                    usage_version: { type: 'number', minimum: 1 },
                },
            },
        },
        cost: { type: 'number' },
        autoRejectBelow: { type: 'number' },
        autoAcceptAbove: { type: 'number' },
        address: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                version: { type: 'number' },
                addressLine1: { type: 'string' },
                addressLine2: { type: 'string' },
                suburb: { type: 'string' },
                state: { type: 'string' },
                postcode: { type: 'string' },
                country: { type: 'string' },
            },
        },
        isOnGroundFloor: { type: 'boolean' },
        isPackagingRequired: { type: 'boolean' },
        isThereSteps: { type: 'boolean' },
        status: { type: 'string' },
        hubspotContactId: { type: 'number' },
        domain: { type: 'string' },
    },
    required: ['accountId'],
} as const;
