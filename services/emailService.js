import nodemailer from 'nodemailer';

const requiredSmtpFields = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];

const hasSmtpConfig = () => requiredSmtpFields.every((key) => process.env[key]);

const getRecipient = () => (
  process.env.CONTACT_TEST_EMAIL ||
  process.env.CONTACT_TO_EMAIL ||
  'hasnshahidd@gmail.com'
);

const getSender = () => (
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

export async function sendSubmissionEmail(submission) {
  const to = getRecipient();
  const subject = submission.subject || `VIEL Website ${submission.type || 'submission'}`;
  const text = buildSubmissionText(submission);
  const transport = makeTransport();

  if (!transport) {
    console.info('[submission:dry-run]', { to, subject, text });
    return { dryRun: true, to };
  }

  await transport.sendMail({
    from: getSender(),
    to,
    replyTo: submission.replyTo || undefined,
    subject,
    text
  });

  return { dryRun: false, to };
}
