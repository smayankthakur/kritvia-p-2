import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM || 'Kritvia <noreply@kritvia.com>',
  replyTo,
}: SendEmailParams): Promise<EmailResult> {
  // Skip if Resend is not configured
  if (!resend) {
    console.warn('RESEND_API_KEY not configured - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });

    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send email';
    return { success: false, error: message };
  }
}

export async function sendContactEmail(
  name: string,
  email: string,
  message: string,
  company?: string,
  phone?: string,
  subject?: string
): Promise<EmailResult> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: 600; color: #4b5563; font-size: 14px; }
        .value { color: #1a1a1a; margin-top: 4px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name</div>
            <div class="value">${escapeHtml(name)}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value">${escapeHtml(email)}</div>
          </div>
          ${subject ? `
          <div class="field">
            <div class="label">Subject</div>
            <div class="value">${escapeHtml(subject)}</div>
          </div>
          ` : ''}
          ${company ? `
          <div class="field">
            <div class="label">Company</div>
            <div class="value">${escapeHtml(company)}</div>
          </div>
          ` : ''}
          ${phone ? `
          <div class="field">
            <div class="label">Phone</div>
            <div class="value">${escapeHtml(phone)}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Message</div>
            <div class="value">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="footer">
          Sent from kritvia.com
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: process.env.CONTACT_EMAIL || 'hello@kritvia.com',
    subject: subject ? `New Contact: ${subject} - ${name}` : `New Contact: ${name} from ${company || 'Individual'}`,
    html,
    replyTo: email,
  });
}

// Simple HTML escaping to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
