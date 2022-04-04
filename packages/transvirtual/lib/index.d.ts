export declare class ItemDimension {
    constructor(weight: number, length: number, width: number, height: number);
    Quantity: number;
    Weight: number;
    Length: number;
    Width: number;
    Height: number;
    Description: string;
}
export declare const estimatePrice: (senderSuburb: string, senderState: string, senderPostcode: string, receiverSuburb: string, receiverState: string, receiverPostcode: string, items: ItemDimension[]) => Promise<any>;
//# sourceMappingURL=index.d.ts.map