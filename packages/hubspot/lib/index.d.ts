export declare const addHSCompany: (businessName: string, businessPhoneNumber: string, connectHSContacts: string[]) => Promise<string>;
export declare const associateContactWithCompany: (contactId: string, companyId: string) => Promise<import("@hubspot/api-client/lib/codegen/crm/associations").PublicAssociation[]>;
export declare const addHSContact: (emailAddress: string, firstName: string) => Promise<string>;
export declare const updateHSContact: (HsId: string, firstName: string, lastName: string, phoneNumber: string) => Promise<string>;
export declare const addHSTask: (taskBody: string, taskHeader: string) => Promise<any>;
export declare const getHSDueDate: (dateIssued: any) => Date;
export declare const associateContactWithTask: (contactId: number, taskId: number) => Promise<any>;
export declare const addReportTicket: (accountId: number, listingId: number, productId: number) => Promise<any>;
export declare const addQuestionReportTicket: (accountId: number, questionId: number) => Promise<any>;
export declare const getHSDeal: (dealId: string) => Promise<import("@hubspot/api-client/lib/codegen/crm/deals").SimplePublicObjectWithAssociations>;
export declare const addHSDeal: (hSBuyerId: string, buyerName: string, buyerPhone: string, buyerAddress: string, hSSellerId: string, sellerAddress: string, amount: number, dealName: string, listingUrl: string) => Promise<{
    dealCreated: import("@hubspot/api-client/lib/codegen/crm/deals").SimplePublicObject;
    updatedContact: import("@hubspot/api-client/lib/codegen/crm/contacts").SimplePublicObject;
    association: import("@hubspot/api-client/lib/codegen/crm/associations").PublicAssociation[];
}>;
//# sourceMappingURL=index.d.ts.map