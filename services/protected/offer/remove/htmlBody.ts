import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';

const htmlBody = (userName, productName, productPage, offerHistoryPage) => {
    return `
<strong>Hi ${userName}</strong>
<br/>
<br/>
The buyer has cancelled their offer on your <strong><a href=${productPage}>${productName}</a></strong>.
<br/>
<br/>
<a href=${offerHistoryPage}>Click here to view the history for this offer.</a>
`;
};
export default htmlBody;
