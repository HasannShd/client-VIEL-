import { sendSubmissionEmail } from './emailService.js';

const validTypes = new Set(['quote', 'contact', 'newsletter', 'chat', 'winterdienst', 'secuguard']);

const cleanString = (value, maxLength = 2000) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

const normalizeData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};

  return Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => {
        if (typeof value === 'string') return [cleanString(key, 80), cleanString(value)];
        if (typeof value === 'number' || typeof value === 'boolean') return [cleanString(key, 80), value];
        return [cleanString(key, 80), value];
      })
      .filter(([key]) => key)
  );
};

export const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export async function handleSubmission(body = {}) {
  const type = cleanString(body?.type, 40);
  const data = normalizeData(body?.data);
  const email = cleanString(data.email || data.newsletterEmail || '');

  if (!validTypes.has(type)) {
    throw createHttpError(400, 'Invalid submission type.');
  }

  if (type !== 'newsletter' && !data.name && !data.message && !data.notes) {
    throw createHttpError(400, 'Submission details are required.');
  }

  if ((type === 'newsletter' || data.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError(400, 'A valid email address is required.');
  }

  const result = await sendSubmissionEmail({
    type,
    data,
    language: cleanString(body?.language, 10),
    source: cleanString(body?.source, 300),
    subject: cleanString(body?.subject, 160),
    replyTo: email
  });

  return {
    ok: true,
    dryRun: result.dryRun,
    message: result.dryRun
      ? 'Submission received in test mode.'
      : 'Submission sent successfully.'
  };
}
