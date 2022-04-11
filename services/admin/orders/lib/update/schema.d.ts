declare const _default: {
    readonly type: "object";
    readonly properties: {
        readonly orderAbn: {
            readonly type: "string";
        };
        readonly orderBusinessName: {
            readonly type: "string";
        };
        readonly orderAddress: {
            readonly type: "object";
            readonly properties: {
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
        readonly listingAddress: {
            readonly type: "object";
            readonly properties: {
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
        readonly shippingFee: {
            readonly type: "number";
        };
        readonly includeGST: {
            readonly type: "boolean";
        };
    };
    readonly required: readonly ["includeGST"];
};
export default _default;
//# sourceMappingURL=schema.d.ts.map