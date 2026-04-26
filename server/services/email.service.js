import nodemailer from 'nodemailer';

/**
 * Lazily-initialized SMTP transporter.
 * Uses Gmail App Password — NOT the user's actual Gmail password.
 * Generate one at: https://myaccount.google.com/apppasswords
 */
let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return transporter;
};

/**
 * Sends an OTP email for email verification (signup flow).
 */
export const sendVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Notelys" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email — Notelys',
        html: buildOtpEmailHtml({
            heading: 'Verify Your Email',
            message: 'Welcome to Notelys! Use the code below to verify your email address.',
            otp,
            footer: 'This code expires in 10 minutes. If you didn\'t create an account, ignore this email.',
        }),
    };

    await getTransporter().sendMail(mailOptions);
};

/**
 * Sends an OTP email for password reset flow.
 */
export const sendPasswordResetEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Notelys" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Your Password — Notelys',
        html: buildOtpEmailHtml({
            heading: 'Reset Your Password',
            message: 'You requested a password reset. Use the code below to set a new password.',
            otp,
            footer: 'This code expires in 10 minutes. If you didn\'t request this, your account is safe — just ignore this email.',
        }),
    };

    await getTransporter().sendMail(mailOptions);
};

/**
 * Builds a clean, responsive HTML email template for OTP delivery.
 */
function buildOtpEmailHtml({ heading, message, otp, footer }) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding:32px 32px 0; text-align:center;">
                                <h1 style="margin:0; font-size:22px; font-weight:700; color:#18181b;">${heading}</h1>
                            </td>
                        </tr>
                        <!-- Message -->
                        <tr>
                            <td style="padding:16px 32px 0; text-align:center;">
                                <p style="margin:0; font-size:15px; color:#52525b; line-height:1.6;">${message}</p>
                            </td>
                        </tr>
                        <!-- OTP Code -->
                        <tr>
                            <td style="padding:28px 32px; text-align:center;">
                                <div style="display:inline-block; padding:16px 40px; background:#f4f4f5; border-radius:8px; letter-spacing:8px; font-size:32px; font-weight:700; color:#18181b; font-family:'Courier New',monospace;">
                                    ${otp}
                                </div>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="padding:0 32px 32px; text-align:center;">
                                <p style="margin:0; font-size:13px; color:#a1a1aa; line-height:1.5;">${footer}</p>
                            </td>
                        </tr>
                    </table>
                    <!-- Brand -->
                    <p style="margin-top:24px; font-size:12px; color:#a1a1aa;">Notelys — Your Writing Space</p>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
}
