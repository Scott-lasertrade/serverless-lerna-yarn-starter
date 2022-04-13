import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';

const htmlBody = (userName, productName, question, answer, linkURL) => {
    return `
    <strong>Hi ${userName},</strong>
    <br/>
    <br/>
    The seller has answered your question about the <span style="color: #1E3D58;">${productName}</span>
    <br/>
    <br/>
    You asked:
    <br/>
    <br/>
    <i style="color: #1E3D58;">'${question}'</i>
    <br/>
    <br/>
    Seller Answered
    <br/>
    <br/>
    <i style="color:#43b0f1;">'${answer}'</i>
    <br/>
    <br/>
    <a href="${linkURL}"
    >Click here to view the product.</a>
`;
};
export default htmlBody;
