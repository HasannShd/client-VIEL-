import nodemailer from 'nodemailer';

const requiredSmtpFields = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const resendApiUrl = 'https://api.resend.com/emails';

const hasSmtpConfig = () => requiredSmtpFields.every((key) => process.env[key]);
const hasResendConfig = () => Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
const getEmailProvider = () => (process.env.EMAIL_PROVIDER || 'auto').toLowerCase();

const getRecipient = () => (
  process.env.CONTACT_TEST_EMAIL ||
  process.env.CONTACT_TO_EMAIL ||
  'Info@viel-gs.de'
);

const getSender = () => (
  process.env.RESEND_FROM_EMAIL ||
  process.env.MAIL_FROM_EMAIL ||
  process.env.SMTP_USER ||
  'website@viel-gs.de'
);

const logDryRun = ({ to, subject, text }) => {
  if (process.env.NODE_ENV === 'production') {
    console.info('[submission:dry-run]', { to, subject, textLength: text.length });
    return;
  }

  console.info('[submission:dry-run]', { to, subject, text });
};

const makeTransport = () => {
  if (!hasSmtpConfig()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const labelMap = {
  name: 'Name',
  email: 'Email',
  newsletterEmail: 'Email',
  phone: 'Phone',
  company: 'Company',
  service: 'Service',
  area: 'Area',
  frequency: 'Frequency',
  pricePerVisit: 'Price per Visit',
  monthlyEstimate: 'Monthly Estimate',
  message: 'Message',
  notes: 'Notes'
};

const typeHeadings = {
  quote: 'New Quote Request',
  contact: 'New Contact Inquiry',
  newsletter: 'New Newsletter Signup',
  winterdienst: 'New Winterdienst Inquiry',
  secuguard: 'New SecuGuard Inquiry',
  chat: 'New Chat Message'
};

const escapeHtml = (str) =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const buildSubmissionHtml = (submission) => {
  const heading = typeHeadings[submission.type] || 'New Submission';
  const data = submission.data || {};
  const source = submission.source || '/';

  const rows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value], i) => {
      const label = labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
      const val = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const bg = i % 2 === 0 ? '#ffffff' : '#f4f9fb';
      const isEmail = key === 'email' || key === 'newsletterEmail';
      const displayVal = isEmail
        ? `<a href="mailto:${escapeHtml(val)}" style="color:#1b4965;text-decoration:none;">${escapeHtml(val)}</a>`
        : escapeHtml(val);
      return `
        <tr style="background:${bg};">
          <td style="padding:14px 20px;color:#455a64;font-size:14px;width:35%;border-bottom:1px solid #e5eef2;">${escapeHtml(label)}</td>
          <td style="padding:14px 20px;color:#0f2d42;font-size:14px;font-weight:600;border-bottom:1px solid #e5eef2;">${displayVal}</td>
        </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(27,73,101,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:#1b4965;padding:28px 32px;">
            <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#62b6cb;font-weight:600;">VIEL Gebäudeservice</p>
            <h1 style="margin:6px 0 0;font-size:22px;color:#ffffff;font-weight:700;">${escapeHtml(heading)}</h1>
          </td>
        </tr>

        <!-- Fields -->
        <tr>
          <td style="padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${rows || `<tr><td style="padding:20px;color:#455a64;">No details provided.</td></tr>`}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#f4f9fb;border-top:1px solid #e5eef2;">
            <p style="margin:0;font-size:12px;color:#8aacbb;">
              Submitted via <a href="https://www.viel-gs.de${escapeHtml(source)}" style="color:#1b4965;text-decoration:none;">viel-gs.de${escapeHtml(source)}</a>
              &nbsp;·&nbsp; Language: ${escapeHtml(submission.language || 'unknown')}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

const buildSubmissionText = (submission) => {
  const data = submission.data || {};
  const lines = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);

  return [
    `New ${submission.type || 'website'} submission from VIEL Gebäudeservice`,
    '',
    `Language: ${submission.language || 'unknown'}`,
    `Source page: ${submission.source || '/'}`,
    '',
    ...lines
  ].join('\n');
};

const sendWithResend = async ({ from, to, subject, text, html, replyTo }) => {
  const response = await fetch(resendApiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      html,
      reply_to: replyTo || undefined
    })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(result.message || 'Resend email delivery failed.');
    error.status = response.status;
    throw error;
  }

  return result;
};

export async function sendSubmissionEmail(submission) {
  const to = getRecipient();
  const from = getSender();
  const subject = submission.subject || `VIEL Website ${submission.type || 'submission'}`;
  const text = buildSubmissionText(submission);
  const html = buildSubmissionHtml(submission);
  const provider = getEmailProvider();
  const validProviders = new Set(['auto', 'dry-run', 'resend', 'smtp']);

  if (!validProviders.has(provider)) {
    throw new Error('Email provider is not supported.');
  }

  if (provider === 'dry-run') {
    logDryRun({ to, subject, text });
    return { dryRun: true, provider: 'dry-run', to };
  }

  if ((provider === 'resend' || provider === 'auto') && hasResendConfig()) {
    await sendWithResend({
      from,
      to,
      subject,
      text,
      html,
      replyTo: submission.replyTo
    });

    return { dryRun: false, provider: 'resend', to };
  }

  const transport = makeTransport();

  if ((provider === 'smtp' || provider === 'auto') && transport) {
    await transport.sendMail({
      from,
      to,
      replyTo: submission.replyTo || undefined,
      subject,
      text,
      html
    });

    return { dryRun: false, provider: 'smtp', to };
  }

  if (provider === 'resend' || provider === 'smtp') {
    throw new Error(`${provider} email delivery is not configured.`);
  }

  if (process.env.NODE_ENV === 'production' && process.env.REQUIRE_EMAIL_DELIVERY === 'true') {
    throw new Error('Email delivery is not configured.');
  }

  {
    logDryRun({ to, subject, text });
    return { dryRun: true, to };
  }
}
