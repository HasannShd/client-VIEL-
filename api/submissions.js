import { handleSubmission } from '../services/submissionHandler.js';

const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim()),
  'https://www.viel-gs.de',
  'https://viel-gs.de'
].filter(Boolean));

const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
