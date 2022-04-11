declare const _default: {
    readonly type: "object";
    readonly properties: {
        readonly id: {
            readonly type: "number";
        };
        readonly name: {
            readonly type: "string";
            readonly minLength: 2;
            readonly maxLength: 64;
        };
        readonly parentId: {
            readonly type: "number";
        };
    };
    readonly required: readonly ["name"];
};
export default _default;
//# sourceMappingURL=schema.d.ts.map