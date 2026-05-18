import express from 'express';
import { sendSubmissionEmail } from '../services/emailService.js';

const router = express.Router();

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

router.post('/', async (req, res, next) => {
  try {
    const type = cleanString(req.body?.type, 40);
    const data = normalizeData(req.body?.data);
    const email = cleanString(data.email || data.newsletterEmail || '');

    if (!validTypes.has(type)) {
      return res.status(400).json({ ok: false, message: 'Invalid submission type.' });
    }

    if (type !== 'newsletter' && !data.name && !data.message && !data.notes) {
      return res.status(400).json({ ok: false, message: 'Submission details are required.' });
    }

    if ((type === 'newsletter' || data.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, message: 'A valid email address is required.' });
    }

    const result = await sendSubmissionEmail({
      type,
      data,
      language: cleanString(req.body?.language, 10),
      source: cleanString(req.body?.source, 300),
      subject: cleanString(req.body?.subject, 160),
      replyTo: email
    });

    return res.json({
      ok: true,
      dryRun: result.dryRun,
      message: result.dryRun
        ? 'Submission received in test mode.'
        : 'Submission sent successfully.'
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
