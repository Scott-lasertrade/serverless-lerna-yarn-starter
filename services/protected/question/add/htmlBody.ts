import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';

const htmlBody = (userName, productName, question, linkURL) => {
    return `
    <strong>Hi ${userName},</strong>
    <br/>
    <br/>
    Someone has asked the following question about your <span style="color: #1E3D58;">${productName}</span>
    <br/>
    <br/>
    <i color: #1E3D58;>'${question}'</i>
    <br/>
    <br/>
    <a href="${linkURL}"
    >Click here to answer this question.</a>
`;
};
export default htmlBody;
