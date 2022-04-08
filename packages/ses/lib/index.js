"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUNAndEmailFromCogId = exports.handelTemplateEmail = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const sesClient = new client_ses_1.SESClient({
    region: 'ap-southeast-2',
});
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const handelTemplateHeader = () => {
    return `<head>
<title></title>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		@media (max-width:565px) {
			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}
		}
	</style>
</head>
<body style="margin: 0; background-color: #ededef; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color:  #ededef;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color:  #ededef; color: #000000; width: 545px;" width="545">
<tbody>
<tr>
<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="20" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td>
<div align="center" style="line-height:10px"><img src="https://handel-email-configuration.s3.ap-southeast-2.amazonaws.com/LogoOnWhite.png" alt="img" style="display: block; height: auto; border: 0; width: 280px; max-width: 100%;"/></div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 545px;" width="545">
<tbody>
<tr>
<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="10" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td>
<div style="font-family: sans-serif">
<div style="font-size: 14px; mso-line-height-alt: 16.8px; color: #555555; line-height: 1.2; font-family: Helvetica">
<br />
<div style="color:black">`;
};
const handelTemplateFooter = () => {
    return `
    </div>
<br />
<br />
</div>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ededef;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ededef; color: #000000; width: 545px;" width="545">
<tbody>
<tr>
<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td style="padding-top:15px;padding-right:10px;padding-bottom:15px;padding-left:10px;">
<div style="font-family: sans-serif">
<div style="font-size: 14px; mso-line-height-alt: 16.8px; color: #555555; line-height: 1.2; font-family: Helvetica">
<p style="margin: 0; font-size: 14px;"><span style="color:#43b0f1;"><strong>+61 3 9000 0333</strong></span></p>
<p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"> </p>
<p style="margin: 0;">112 / 585 Little Collins St, Melbourne, Australia</p>
<p style="margin: 0; mso-line-height-alt: 16.8px;"> </p>
</div>
</div>
</td>
</tr>
</table>
</td>
<td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td style="color:#000000;text-align:center;padding-top:10px;padding-right:5px;padding-bottom:5px;padding-left:5px;font-family:inherit;font-size:14px;">
<table align="center" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
<tr>
<td style="text-align:center;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;"><a href="https://www.facebook.com/laser.trade.aus/" target="_blank" rel="noreferrer" ><img align="center" class="icon" height="32" src="https://handel-email-configuration.s3.ap-southeast-2.amazonaws.com/email+resources/iconFB.png" style="display: block; height: auto; border: 0;" width="32"/></a></td>
<td style="text-align:center;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;"><a href="https://www.linkedin.com/company/lasertrade/" target="_blank" rel="noreferrer" ><img align="center" class="icon" height="32" src="https://handel-email-configuration.s3.ap-southeast-2.amazonaws.com/email+resources/iconIN.png" style="display: block; height: auto; border: 0;" width="32"/></a></td>
<td style="text-align:center;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;"><a href="https://www.instagram.com/laser_trade/" target="_blank" rel="noreferrer" ><img align="center" class="icon" height="32" src="https://handel-email-configuration.s3.ap-southeast-2.amazonaws.com/email+resources/iconIG.png" style="display: block; height: auto; border: 0;" width="32"/></a></td>
</tr>
</table>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td style="padding-top:10px;padding-right:10px;padding-bottom:15px;padding-left:10px;">
<div style="font-family: sans-serif">
<div style="font-size: 14px; mso-line-height-alt: 16.8px; color: #555555; line-height: 1.2; font-family: Helvetica">
<p style="margin: 0; font-size: 14px; text-align: center;"><a href="${process.env.HOSTING_DOMAIN}" rel="noopener" style="color: #0068A5;" target="_blank">${process.env.HOSTING_DOMAIN}</a></p>
</div>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

</td>
</tr>
</tbody>
</table><!-- End -->
</body>`;
};
const handelTemplateEmail = (emailSubject, emailBody, emailToAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = {
        Data: emailSubject,
    };
    const finalEmail = `${handelTemplateHeader()}${emailBody}${handelTemplateFooter()}`;
    const bodyText = {
        Data: finalEmail,
    };
    const body = {
        Html: bodyText,
    };
    const message = {
        Subject: subject,
        Body: body,
    };
    const destination = {
        ToAddresses: [emailToAddress],
    };
    try {
        console.log(`Attempting to send email to ${emailToAddress}`);
        const data = yield sesClient.send(new client_ses_1.SendEmailCommand({
            Destination: destination,
            Message: message,
            Source: 'info@lasersharks.click',
        }));
        console.log(data);
        console.log('Email Message Id: ', data.MessageId);
        return data;
    }
    catch (error) {
        console.error(`❌ Failed to send email: `, error);
        return {
            error: 'Could not send the email',
        };
    }
});
exports.handelTemplateEmail = handelTemplateEmail;
const getUNAndEmailFromCogId = (cogId) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        const config = {
            region: 'ap-southeast-2',
        };
        const client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient(config);
        const adminGetUserInput = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: cogId,
        };
        const adminGetUserCommand = new client_cognito_identity_provider_1.AdminGetUserCommand(adminGetUserInput);
        user = yield client.send(adminGetUserCommand);
    }
    catch (error) {
        console.log('AUTHENTICATION ERROR: ', JSON.stringify(error, null, 2));
        return { error: error };
    }
    const userName = user.UserAttributes[user.UserAttributes.findIndex((arr) => arr.Name === 'given_name')].Value;
    const emailAddress = user.UserAttributes[user.UserAttributes.findIndex((arr) => arr.Name === 'email')].Value;
    console.log(user);
    return { userName, emailAddress };
});
exports.getUNAndEmailFromCogId = getUNAndEmailFromCogId;
exports.default = exports.handelTemplateEmail;
//# sourceMappingURL=index.js.map