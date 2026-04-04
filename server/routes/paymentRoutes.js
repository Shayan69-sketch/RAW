import express from 'express';
import {
  createStripeIntent, stripeWebhook,
  createPaypalOrder, capturePaypalOrder,
} from '../controllers/paymentController.js';
import { verifyToken, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/stripe/create-intent', optionalAuth, createStripeIntent);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/paypal/create-order', optionalAuth, createPaypalOrder);
router.post('/paypal/capture-order', optionalAuth, capturePaypalOrder);

export default router;
