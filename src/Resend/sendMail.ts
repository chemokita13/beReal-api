import { Resend } from 'resend';

export function sendMail(title: string, body: string) {
    const resend = new Resend(process.env.SEND_KEY);
    console.log(body);
    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'chemokita13@gmail.com',
        subject: title,
        html: body,
    });
}
