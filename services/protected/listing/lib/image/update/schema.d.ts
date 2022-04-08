declare const _default: {
    readonly type: "object";
    readonly properties: {
        readonly imagesList: {
            readonly type: "array";
            readonly uniqueItems: true;
            readonly items: {
                readonly type: "object";
                readonly properties: {
                    readonly id: {
                        readonly type: readonly ["string", "number"];
                    };
                    readonly bucket: {
                        readonly type: "string";
                    };
                    readonly region: {
                        readonly type: "string";
                    };
                    readonly order: {
                        readonly type: "number";
                    };
                    readonly image: {
                        readonly type: "string";
                    };
                    readonly mime: {
                        readonly enum: readonly ["image/jpeg", "image/jpg", "image/png", "image/jsp"];
                    };
                    readonly updated: {
                        readonly type: "boolean";
                    };
                };
            };
        };
    };
    readonly required: readonly ["imagesList"];
};
export default _default;
//# sourceMappingURL=schema.d.ts.map