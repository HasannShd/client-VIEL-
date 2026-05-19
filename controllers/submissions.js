import express from 'express';
import { handleSubmission } from '../services/submissionHandler.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const result = await handleSubmission(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
