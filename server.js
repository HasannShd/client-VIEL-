import 'dotenv/config';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import submissionRoutes from './controllers/submissions.js';
import { buildCanonicalUrl, defaultImage, getSeoForPath, normalizeSeoPath } from './src/data/seoData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || '127.0.0.1';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const allowedOrigins = Array.from(new Set([
  process.env.CLIENT_URL,
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim()),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'https://www.viel-gs.de',
  'https://viel-gs.de'
].filter(Boolean)));

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: process.env.NODE_ENV === 'production'
    ? { maxAge: 31536000, includeSubDomains: true, preload: false }
    : false
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(compression());
app.use(express.json({ limit: '100kb' }));

const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'viel-submissions' });
});

app.use('/api/submissions', submissionLimiter, submissionRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ ok: false, message: 'API route not found.' });
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, {
  index: false,
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

app.get(/.*/, async (req, res, next) => {
  try {
    const seo = getSeoForPath(req.path);
    const canonicalUrl = buildCanonicalUrl(normalizeSeoPath(req.path));
    const indexHtml = await fs.readFile(path.join(distPath, 'index.html'), 'utf8');
    const html = indexHtml
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(seo.description)}" />`)
      .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(seo.keywords || '')}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(seo.title)}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(seo.description)}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`)
      .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${escapeHtml(defaultImage)}" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`)
      .replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${escapeHtml(defaultImage)}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`);

    res.type('html').send(html);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error('[api]', error);
  return res.status(error.status || 500).json({
    ok: false,
    message: error.message || 'Internal server error.'
  });
});

app.listen(port, host, () => {
  console.log(`VIEL backend running on http://${host}:${port}`);
});
