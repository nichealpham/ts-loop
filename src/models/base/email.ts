import { CommonFunctions } from "../../utils/common";

let EmailTemplate = require('../../define/email-template.json');

export default (Email: any) => {

    Email.sendEmail = async (templateName: string, toEmail: string, options = null) => {
        let template = EmailTemplate[templateName];
        options = { ...template.options, ...options };
        for (let key in (options || {})) {
            template.subject = template.subject.replace(`[${key}]`, options[key]);
            template.text = template.text.replace(`[${key}]`, options[key]);
            template.html = template.html.replace(`[${key}]`, options[key]);
        };
        let email = {
            from: Email.getDataSource().settings.sender_email,
            to: toEmail,
            subject: template.subject,
            text: template.text,
            html: template.html,
        };
        await Email.send(email).catch(error => {
            console.log('SEND_EMAIL_FAILED', error);
            throw CommonFunctions.systemError('SEND_EMAIL_FAILED');
        });
        return {
            toEmail,
            templateName,
            isSuccess: true
        };
    };
};