import nodemailer from 'nodemailer';

const requiredSmtpFields = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const resendApiUrl = 'https://api.resend.com/emails';

const hasSmtpConfig = () => requiredSmtpFields.every((key) => process.env[key]);
const hasResendConfig = () => Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
const getEmailProvider = () => (process.env.EMAIL_PROVIDER || 'auto').toLowerCase();

const getRecipient = () => (
  process.env.CONTACT_TEST_EMAIL ||
  process.env.CONTACT_TO_EMAIL ||
  'hasnshahidd@gmail.com'
);

const getSender = () => (
  process.env.RESEND_FROM_EMAIL ||
  process.env.MAIL_FROM_EMAIL ||
  process.env.SMTP_USER ||
  'website@viel-gs.de'
);

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

const formatField = ([key, value]) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'object') return `${key}: ${JSON.stringify(value)}`;
  return `${key}: ${value}`;
};

const buildSubmissionText = (submission) => {
  const details = Object.entries(submission.data || {})
    .map(formatField)
    .filter(Boolean)
    .join('\n');

  return [
    `New ${submission.type || 'website'} submission from VIEL Gebäudeservice`,
    '',
    `Language: ${submission.language || 'unknown'}`,
    `Source page: ${submission.source || '/'}`,
    '',
    details || 'No submission details were provided.'
  ].join('\n');
};

const sendWithResend = async ({ from, to, subject, text, replyTo }) => {
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
  const provider = getEmailProvider();

  if (provider === 'dry-run') {
    console.info('[submission:dry-run]', { to, subject, text });
    return { dryRun: true, provider: 'dry-run', to };
  }

  if ((provider === 'resend' || provider === 'auto') && hasResendConfig()) {
    await sendWithResend({
      from,
      to,
      subject,
      text,
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
      text
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
    console.info('[submission:dry-run]', { to, subject, text });
    return { dryRun: true, to };
  }
}
