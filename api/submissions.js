import { handleSubmission } from '../services/submissionHandler.js';

const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMax = 8;
const rateLimitStore = new Map();

const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim()),
  'https://www.viel-gs.de',
  'https://viel-gs.de'
].filter(Boolean));

const getSameOrigin = (req) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';

  return host ? `${protocol}://${host}` : '';
};

const isAllowedOrigin = (req) => {
  const origin = req.headers.origin;

  return !origin || allowedOrigins.has(origin) || origin === getSameOrigin(req);
};

const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(req)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
};

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.socket?.remoteAddress || 'unknown';
};

const checkRateLimit = (req, res) => {
  const now = Date.now();
  const clientIp = getClientIp(req);
  const current = rateLimitStore.get(clientIp);
  const entry = current && current.resetAt > now
    ? { count: current.count + 1, resetAt: current.resetAt }
    : { count: 1, resetAt: now + rateLimitWindowMs };

  rateLimitStore.set(clientIp, entry);

  if (entry.count > rateLimitMax) {
    res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
    return false;
  }

  if (rateLimitStore.size > 500) {
    for (const [ip, value] of rateLimitStore.entries()) {
      if (value.resetAt <= now) rateLimitStore.delete(ip);
    }
  }

  return true;
};

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ ok: false, message: 'Origin is not allowed.' });
  }

  if (!checkRateLimit(req, res)) {
    return res.status(429).json({ ok: false, message: 'Too many submissions. Please try again later.' });
  }

  try {
    const result = await handleSubmission(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[api/submissions]', error);
    return res.status(error.status || 500).json({
      ok: false,
      message: error.message || 'Internal server error.'
    });
  }
}
