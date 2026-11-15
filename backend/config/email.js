import nodemailer from 'nodemailer';
import { render } from '@react-email/components';

let transporterInstance = null;

const getTransporter = () => {
  if (!transporterInstance && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporterInstance = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS.replace(/\s+/g, ''), // Strip any accidental spaces
      },
    });
  }
  return transporterInstance;
};

/**
 * Sends an email using a React Email component via Gmail SMTP (Nodemailer).
 * Fallback: If SMTP credentials are not configured, logs simulated delivery.
 */
export const sendNotificationEmail = async ({ to, subject, templateElement }) => {
  try {
    if (!to) {
      console.warn('[Email Service] Recipient email is missing. Skipping.');
      return { success: false, message: 'Recipient email missing' };
    }

    // Render React Email JSX element to HTML string
    const html = await render(templateElement);

    const transporter = getTransporter();
    if (!transporter) {
      // shortcut: logs simulated delivery when SMTP is not configured in .env
      console.log(`[Email Service Simulation] SMTP credentials missing. Email prepared for: ${to} | Subject: "${subject}"`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from: `"Prescripto" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`[Email Service] Successfully sent email to ${to} (MessageId: ${info.messageId})`);
    return { success: true, data: info };
  } catch (error) {
    console.error(`[Email Service Error] Failed to send email to ${to}:`, error.message);
    // Do not throw so caller workflow is not blocked
    return { success: false, error: error.message };
  }
};
