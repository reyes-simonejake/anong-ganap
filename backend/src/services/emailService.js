import axios from 'axios';

const MAILJET_URL = 'https://api.mailjet.com/v3.1/send';

/**
 * Sends an email via Mailjet.
 * Falls back to console log in development when keys are not set.
 */
export const sendEmail = async (to, subject, message, htmlMessage = null) => {
    const apiKey = process.env.EMAIL_API_KEY;
    const apiSecret = process.env.EMAIL_API_SECRET;
    const fromEmail = process.env.EMAIL_FROM || 'noreply@anongganap.com';
    const fromName = process.env.EMAIL_FROM_NAME || 'Anong Ganap';

    // Dev fallback — no real keys configured
    if (!apiKey || apiKey === 'your_mailjet_api_key') {
        console.log('📧 [DEV] Email not sent (no API key). Would have sent:');
        console.log(`  To: ${to}`);
        console.log(`  Subject: ${subject}`);
        console.log(`  Message: ${message}`);
        return { success: true, dev: true };
    }

    const payload = {
        Messages: [
            {
                From: { Email: fromEmail, Name: fromName },
                To: [{ Email: to }],
                Subject: subject,
                TextPart: message,
                ...(htmlMessage && { HTMLPart: htmlMessage }),
            },
        ],
    };

    const response = await axios.post(MAILJET_URL, payload, {
        auth: { username: apiKey, password: apiSecret },
        headers: { 'Content-Type': 'application/json' },
    });

    return {
        success: true,
        messageId: response.data.Messages?.[0]?.To?.[0]?.MessageID,
    };
};

/**
 * Builds an HTML invitation email body.
 */
export const buildInvitationHTML = (plan, message, inviteLink) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: sans-serif; background: #f9fafb; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #6366f1; color: #fff; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .body { padding: 24px; color: #1f2937; line-height: 1.6; }
    .btn { display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; margin-top: 16px; }
    .footer { text-align: center; padding: 16px; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Anong Ganap?</h1>
      <p style="margin:8px 0 0">You've been invited!</p>
    </div>
    <div class="body">
      <p>${message.replace(/\n/g, '<br/>')}</p>
      <p><strong>📍 Location:</strong> ${plan.location}</p>
      <a class="btn" href="${inviteLink}">View the Plan</a>
    </div>
    <div class="footer">Anong Ganap? — AI-powered activity planner</div>
  </div>
</body>
</html>
`;
