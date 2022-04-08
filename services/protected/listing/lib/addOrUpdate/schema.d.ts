declare const _default: {
    readonly type: "object";
    readonly properties: {
        readonly id: {
            readonly type: "number";
        };
        readonly version: {
            readonly type: "number";
        };
        readonly accountId: {
            readonly type: "number";
        };
        readonly accountVersion: {
            readonly type: "number";
        };
        readonly accountAddressId: {
            readonly type: "number";
        };
        readonly accountAddressVersion: {
            readonly type: "number";
        };
        readonly saveAsDefault: {
            readonly type: "boolean";
        };
        readonly productId: {
            readonly type: "number";
        };
        readonly productVersion: {
            readonly type: "number";
        };
        readonly productName: {
            readonly type: "string";
        };
        readonly productEdited: {
            readonly type: "boolean";
        };
        readonly manufacturers: {
            readonly type: "array";
            readonly uniqueItems: true;
            readonly items: {
                readonly type: "object";
                readonly properties: {
                    readonly key: {
                        readonly type: "string";
                    };
                    readonly value: {
                        readonly type: "string";
                    };
                };
            };
        };
        readonly serialNumber: {
            readonly type: "string";
        };
        readonly YOM: {
            readonly type: "number";
        };
        readonly usageTypeId: {
            readonly type: "number";
        };
        readonly usageId: {
            readonly type: "number";
        };
        readonly usageVersion: {
            readonly type: "number";
        };
        readonly usageValue: {
            readonly type: "number";
        };
        readonly comment: {
            readonly type: "string";
        };
        readonly accessories: {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly properties: {
                    readonly id: {
                        readonly type: "number";
                        readonly minimum: 1;
                    };
                    readonly version: {
                        readonly type: "number";
                        readonly minimum: 1;
                    };
                    readonly active: {
                        readonly type: "boolean";
                    };
                    readonly product_id: {
                        readonly type: "number";
                        readonly minimum: 1;
                    };
                    readonly usage_type_id: {
                        readonly type: "number";
                        readonly minimum: 1;
                    };
                    readonly usage_id: {
                        readonly type: "number";
                    };
                    readonly usage_value: {
                        readonly type: "number";
                    };
                    readonly usage_version: {
                        readonly type: "number";
                        readonly minimum: 1;
                    };
                };
            };
        };
        readonly cost: {
            readonly type: "number";
        };
        readonly autoRejectBelow: {
            readonly type: "number";
        };
        readonly autoAcceptAbove: {
            readonly type: "number";
        };
        readonly address: {
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "number";
                };
                readonly version: {
                    readonly type: "number";
                };
                readonly addressLine1: {
                    readonly type: "string";
                };
                readonly addressLine2: {
                    readonly type: "string";
                };
                readonly suburb: {
                    readonly type: "string";
                };
                readonly state: {
                    readonly type: "string";
                };
                readonly postcode: {
                    readonly type: "string";
                };
                readonly country: {
                    readonly type: "string";
                };
            };
        };
        readonly isOnGroundFloor: {
            readonly type: "boolean";
        };
        readonly isPackagingRequired: {
            readonly type: "boolean";
        };
        readonly isThereSteps: {
            readonly type: "boolean";
        };
        readonly status: {
            readonly type: "string";
        };
        readonly hubspotContactId: {
            readonly type: "number";
        };
        readonly domain: {
            readonly type: "string";
        };
    };
    readonly required: readonly ["accountId"];
};
export default _default;
//# sourceMappingURL=schema.d.ts.map