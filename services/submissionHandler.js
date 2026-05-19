import { sendSubmissionEmail } from './emailService.js';

const validTypes = new Set(['quote', 'contact', 'newsletter', 'chat', 'winterdienst', 'secuguard']);
const maxDataFields = 20;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const spamTrapFields = new Set(['website', 'url', 'homepage']);

const allowedFieldsByType = {
  quote: new Set(['name', 'email', 'company', 'phone', 'service', 'area', 'frequency', 'pricePerVisit', 'monthlyEstimate', 'notes']),
  contact: new Set(['name', 'company', 'email', 'message']),
  newsletter: new Set(['newsletterEmail']),
  chat: new Set(['message']),
  winterdienst: new Set(['name', 'email', 'company', 'phone', 'message', 'notes', 'area', 'service']),
  secuguard: new Set(['name', 'email', 'company', 'phone', 'message', 'notes', 'service'])
};

const requiredFieldsByType = {
  quote: ['name', 'email'],
  contact: ['name', 'email', 'message'],
  newsletter: ['newsletterEmail'],
  chat: ['message'],
  winterdienst: ['name', 'email'],
  secuguard: ['name', 'email']
};

const fieldLengthLimits = {
  name: 120,
  email: 254,
  newsletterEmail: 254,
  phone: 60,
  company: 160,
  service: 160,
  area: 80,
  frequency: 80,
  pricePerVisit: 80,
  monthlyEstimate: 120,
  message: 3000,
  notes: 3000
};

const isPlainObject = (value) => (
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype
);

const cleanString = (value, maxLength = 2000) => {
  if (typeof value !== 'string') return '';
  return value
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join('')
    .trim()
    .slice(0, maxLength);
};

const cleanDataValue = (key, value) => {
  const maxLength = fieldLengthLimits[key] || 500;

  if (typeof value === 'string') return cleanString(value, maxLength);
  if (typeof value === 'number' || typeof value === 'boolean') return cleanString(String(value), maxLength);

  return '';
};

const normalizeSource = (value) => {
  const source = cleanString(value, 300);

  if (!source || !source.startsWith('/') || source.startsWith('//')) return '/';

  return source;
};

const normalizeData = (type, data) => {
  if (!isPlainObject(data)) return {};

  const allowedFields = allowedFieldsByType[type] || new Set();
  const entries = Object.entries(data);

  if (entries.length > maxDataFields) {
    throw createHttpError(400, 'Too many submission fields.');
  }

  return entries.reduce((cleanedData, [rawKey, value]) => {
    const key = cleanString(rawKey, 80);

    if (!key || !allowedFields.has(key)) return cleanedData;

    const cleanedValue = cleanDataValue(key, value);
    if (cleanedValue) cleanedData[key] = cleanedValue;

    return cleanedData;
  }, {});
};

export const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export async function handleSubmission(body = {}) {
  if (!isPlainObject(body)) {
    throw createHttpError(400, 'Invalid submission payload.');
  }

  const type = cleanString(body?.type, 40);
  const data = normalizeData(type, body?.data);
  const email = cleanString(data.email || data.newsletterEmail || '');
  const requiredFields = requiredFieldsByType[type] || [];

  if (!validTypes.has(type)) {
    throw createHttpError(400, 'Invalid submission type.');
  }

  if (Object.keys(body?.data || {}).some((key) => spamTrapFields.has(cleanString(key, 80)) && cleanString(body.data[key]))) {
    throw createHttpError(400, 'Invalid submission payload.');
  }

  if (requiredFields.some((field) => !data[field])) {
    throw createHttpError(400, 'Submission details are required.');
  }

  if ((type === 'newsletter' || data.email) && !emailPattern.test(email)) {
    throw createHttpError(400, 'A valid email address is required.');
  }

  const result = await sendSubmissionEmail({
    type,
    data,
    language: cleanString(body?.language, 10),
    source: normalizeSource(body?.source),
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
