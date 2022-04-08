declare const _default: {
    readonly type: "object";
    readonly properties: {
        readonly id: {
            readonly type: "number";
        };
        readonly buyerDetails: {
            readonly type: "object";
            readonly properties: {
                readonly fName: {
                    readonly type: "string";
                };
                readonly lName: {
                    readonly type: "string";
                };
                readonly email: {
                    readonly type: "string";
                };
                readonly phone: {
                    readonly type: "string";
                };
                readonly bName: {
                    readonly type: "string";
                };
                readonly taxId: {
                    readonly type: "string";
                };
            };
        };
        readonly address: {
            readonly type: "object";
            readonly properties: {
                readonly line1: {
                    readonly type: "string";
                };
                readonly line2: {
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
    };
    readonly required: readonly ["buyerDetails", "address"];
};
export default _default;
//# sourceMappingURL=schema.d.ts.map