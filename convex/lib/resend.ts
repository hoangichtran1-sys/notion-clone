import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
    if (!resend) {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            throw new Error("Missing RESEND_API_KEY");
        }

        resend = new Resend(apiKey);
    }

    return resend;
}

export interface SendMailProps {
    from?: string;
    to: string;
    subject: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>;
    html: string;
    replyTo?: string;
}

export async function sendEmail({ from, to, subject, html, replyTo }: SendMailProps) {
    try {
        const resend = getResend();

        const { data, error } = await resend.emails.send({
            from: from || "Noreply <onboarding@resend.dev>",
            to,
            subject,
            html,
            replyTo,
        });

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Resend Error: ", error);
        throw error;
    }
}
