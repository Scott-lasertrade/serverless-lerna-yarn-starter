import 'source-map-support/register';
import { Callback, Context, PostConfirmationTriggerEvent } from 'aws-lambda';
import { handelTemplateEmail } from '@medii/ses';

const emailConfirmationBody = (userName) => {
    console.log(`Hosting Domain is: ${process.env.HOSTING_DOMAIN}`);
    return `<p style="margin: 0;"><strong>Hi ${userName},</strong></p>
<p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"></p>
<p style="margin: 0;">Thanks for signing up with Handel.</p>
<p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"></p>
<p style="margin: 0;">Here are some quick links to help you started:</p>
<p style="margin: 0; mso-line-height-alt: 16.8px;"></p>
<p dir="ltr" style="margin: 0; text-align: left;"><strong>Looking to sell?</strong></p>
<p dir="ltr" style="margin: 0; text-align: left;"><a href="${process.env.HOSTING_DOMAIN}/account/sell/create" rel="noopener" style="color: #0068A5;" target="_blank">Click here to sell a product.</a></p>
<p dir="ltr" style="margin: 0; text-align: left; mso-line-height-alt: 16.8px;"></p>
<p dir="ltr" style="margin: 0; text-align: left;"><strong>Looking to buy?</strong></p>
<p dir="ltr" style="margin: 0; text-align: left;"><a href="${process.env.HOSTING_DOMAIN}/shop" rel="noopener" style="color: #0068A5;" target="_blank">Click here to browse the marketplace.</a></p>
<p dir="ltr" style="margin: 0; text-align: left; mso-line-height-alt: 16.8px;"></p>
<p dir="ltr" style="margin: 0; text-align: left;"><strong>Want to update your details?</strong></p>
<p dir="ltr" style="margin: 0; text-align: left;"><a href="${process.env.HOSTING_DOMAIN}/auth/profile" rel="noopener" style="color: #0068A5;" target="_blank">Click here to visit your profile.</a></p>
<p dir="ltr" style="margin: 0; text-align: left; mso-line-height-alt: 16.8px;"></p>
<p dir="ltr" style="margin: 0; text-align: left;"><strong>Need more help?</strong></p>
<p dir="ltr" style="margin: 0; text-align: left;"><a href="${process.env.HOSTING_DOMAIN}/support" rel="noopener" style="color: #0068A5;" target="_blank">Click here to visit our knowledgebase.</a></p>
<p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"></p>
<p style="margin: 0;">If you need any help with buying, selling or using the site, feel free to contact us through the website.</p>`;
};

export async function main(
    event: PostConfirmationTriggerEvent,
    _context: Context,
    callback: Callback
): Promise<void> {
    console.log(event);
    const userName = event.request.userAttributes.given_name;
    const emailAddress = event.request.userAttributes.email;
    const emailBody = emailConfirmationBody(userName);

    console.log('POST CONFIRMATION EVENT', JSON.stringify(event, null, 2));
    let response;
    if (event.request.userAttributes.email) {
        response = await handelTemplateEmail(
            'Welcome to Handel',
            emailBody,
            emailAddress
        );
    }
    return callback(null, event);
}
