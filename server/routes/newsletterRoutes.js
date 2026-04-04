import express from 'express';
import { subscribe, unsubscribe } from '../controllers/newsletterController.js';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/subscribe',
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  subscribe
);

router.post(
  '/unsubscribe',
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  unsubscribe
);

export default router;
