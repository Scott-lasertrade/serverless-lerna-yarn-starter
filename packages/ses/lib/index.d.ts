export declare const handelTemplateEmail: (emailSubject: string, emailBody: string, emailToAddress: string) => Promise<any>;
export declare const getUNAndEmailFromCogId: (cogId: string) => Promise<{
    userName?: string | undefined;
    emailAddress?: string | undefined;
    error?: any;
}>;
export default handelTemplateEmail;
//# sourceMappingURL=index.d.ts.map