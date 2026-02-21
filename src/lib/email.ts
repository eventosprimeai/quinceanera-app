import nodemailer from 'nodemailer';

// In production, configure with real SMTP/API credentials via env vars
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
});

interface SendQuoteEmailParams {
    to: string;
    clientName: string;
    quoteId: string;
    htmlBody: string;
    pdfBuffer?: Buffer;
}

export async function sendQuoteEmail({
    to,
    clientName,
    quoteId,
    htmlBody,
    pdfBuffer,
}: SendQuoteEmailParams): Promise<boolean> {
    const ccAddress = process.env.SALES_EMAIL || 'ventas@eventosprimeai.com';

    const mailOptions: nodemailer.SendMailOptions = {
        from: `"PrimeAI Events" <${process.env.SMTP_USER || 'noreply@eventosprimeai.com'}>`,
        to,
        cc: ccAddress,
        subject: `✨ Tu cotización de quinceañera — ${quoteId}`,
        html: htmlBody,
        attachments: pdfBuffer
            ? [
                {
                    filename: `Cotizacion-${quoteId}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ]
            : [],
    };

    // If no SMTP configured, just log and return true (dev mode)
    if (!process.env.SMTP_USER) {
        console.log('[EMAIL] Dev mode — email not sent. Would send to:', to);
        console.log('[EMAIL] CC:', ccAddress);
        console.log('[EMAIL] Subject:', mailOptions.subject);
        return true;
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log('[EMAIL] Sent to:', to, '| CC:', ccAddress);
        return true;
    } catch (error) {
        console.error('[EMAIL] Error sending email:', error);
        return false;
    }
}
