import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';

export const htmlBody = (userName, productName, productPage, editPage) => {
    return `
    <strong>Hi ${userName},</strong>
    <br/>
    <br/>
    Thanks for submitting your <strong><a href=${productPage}>${productName}</a></strong>.
    <br/>
    <br/>
    Your product has been approved and is now listed on the marketplace.
    <br/>
    <br/>
    <a href=${productPage}>Click here to view your product</a>.
    <br/>
    <a href=${editPage}
    >Click here to edit your product (Edits may require approval)</a>
    <br/>
    <a href="${process.env.HOSTING_DOMAIN}/support"
    >Click here for listing advice to help you sell your device faster.</a>
    <br/>
    <br/>
    If you have any questions you can contact us through the website.
`;
};
export const htmlBodyReject = (
    userName,
    productName,
    reason,
    productPage,
    editPage
) => {
    return `
<strong>Hi ${userName},</strong>
    <br/>
    <br/>
Thanks for submitting your <strong><a href=${productPage}>${productName}</a></strong>,
    <br/>
    <br/>
Unfortunately your listing has been rejected for the following reasons:
    <br/>
    <br/>
<strong>${reason}</strong>
    <br/>
    <br/>
<a href=${editPage}>Click here to edit your product</a>
    <br/>
    <br/>
If you have any questions you can contact us through the website.

`;
};
