import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();
const nodemailer = require("nodemailer");

// Exporrar la función enviarEmail
export async function enviar_Email(Destinatario: any, html_template: any, subject: string): Promise<string> {

    const email_Server = configService.get<string>('NODEMAILER_EMAIL');
    const email_Password = configService.get<string>('NODEMAILER_PASSWORD');
    
    try {

        // Construir el transportador de nodemailer
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email_Server,
                pass: email_Password,
            },
        });

        // Contruir el paquete del mensaje
        const msg = {
            to: Destinatario,
            from: email_Server,
            subject: subject,
            html: html_template,
        };

        // Enviar el email
        transporter.sendMail(msg, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        return 'Email sent successfully';
    } catch (error) {
        throw new Error('Error sending email');
    }
}
