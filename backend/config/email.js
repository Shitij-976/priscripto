import { Resend } from 'resend';
import { render } from '@react-email/components';

let resendInstance = null;

const getResend = () => {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

/**
 * Sends an email using a React Email component.
 * Fallback: If RESEND_API_KEY is not configured in .env, logs a dev preview and continues.
 */
export const sendNotificationEmail = async ({ to, subject, templateElement }) => {
  try {
    if (!to) {
      console.warn('[Email Service] Recipient email is missing. Skipping.');
      return;
    }

    // Render React Email JSX element to HTML string
    const html = await render(templateElement);

    const resend = getResend();
    if (!resend) {
      // shortcut: logs simulated delivery in dev when RESEND_API_KEY is not set, add RESEND_API_KEY in .env to send real emails
      console.log(`[Email Service Simulation] Key missing. Email prepared for: ${to} | Subject: "${subject}"`);
      return { success: true, simulated: true };
    }

    const fromAddress = process.env.EMAIL_FROM || 'Prescripto <onboarding@resend.dev>';
    const data = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    });

    console.log(`[Email Service] Successfully sent email to ${to} (ID: ${data.data?.id || 'ok'})`);
    return { success: true, data };
  } catch (error) {
    console.error(`[Email Service Error] Failed to send email to ${to}:`, error.message);
    // Do not throw so caller workflow (booking/cancel) is not blocked
    return { success: false, error: error.message };
  }
};
