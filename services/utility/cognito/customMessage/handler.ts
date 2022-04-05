import 'source-map-support/register';

const template = (message: string, email: string, link: string) => `
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<style type="text/css">
    body {
        margin: 0;
        font: 12px/16px Arial, sans-serif;
    }
    /* buttons */
    .buttonComponent {
        border-collapse: separate;
        text-decoration: none !important;
        line-height: 47px;
        border-radius: 3px;
        border-style: solid;
        border-color: #1E3D58;
        border-width: 1px;
        background: #43B0F1 linear-gradient(#057DCD, #43B0F1) repeat scroll 0%=0%;
        background-color: #43B0F1;
        white-space: nowrap;
        min-width: 150px;
        min-height: 27px;
    }

    .buttonComponentLink {
        color: rgb(27, 27, 27) !important;
        font: 16px/ 18px Arial, sans-serif !important;
        display: table-cell;
        margin: auto 0;
        vertical-align: middle;
        min-width: 150px;
        height: 47px;
    }
</style>
</head>

<body>
    <div class="greeting">
        Hello ${email},
        <br />
        ${message}
        <br />
        <br />
        <br />
    </div>
    
    <table id="container" class="buttonComponent" bgcolor="#ffa723" width="222">
        <tbody>
            <tr>
                <td style="width:100%; vertical-align:middle;" align="center" valign="middle" width="100%" height="27">
                    <a class="buttonComponentLink" href="${link}"> 
                        Click here
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`;

const customMessage: any = async (event, context, callback) => {
    console.log(event);
    const url = process.env.HOSTING_DOMAIN;
    const userName = event.userName;
    const region = event.region;
    const email = event.request.userAttributes.email;
    const codeParameter = event.request.codeParameter;
    const clientId = event.callerContext.clientId;

    if (event.triggerSource === 'CustomMessage_SignUp') {
        const link =
            url +
            '/auth/accountConfirmation' +
            '?code=' +
            codeParameter +
            '&clientId=' +
            clientId +
            '&region=' +
            region +
            '&email=' +
            email;
        // let lang = event.body.request.userAttributes['locale']; // Access the event data of custom user Attribute lang
        // translator.setLanguage(lang);

        event.response.smsMessage =
            'Click on this link to verify your contact info: ' + ' ' + link;
        event.response.emailSubject =
            'Action Required: Verify your contact info.';
        event.response.emailMessage = template(
            `${email} Thank you for creating an account with us at Handel. Please click on the below link to confirm the registration!`,
            email,
            link
        );
    } else if (event.triggerSource === 'CustomMessage_ForgotPassword') {
        const link =
            url +
            '/auth/reset-password' +
            '?code=' +
            codeParameter +
            '&email=' +
            email;
        //Only english at present.

        event.response.emailSubject = 'HANDEL: Password reset.';
        const emailMessage =
            'Follow the link below to reset your password. If you did not request this password reset, please notify support!';
        event.response.emailMessage = template(emailMessage, email, link);
    }

    callback(null, event);
};

export const main = customMessage;
