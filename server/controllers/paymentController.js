import stripe from '../config/stripe.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createStripeIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'usd', metadata = {} } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe wants cents
    currency,
    metadata: {
      ...metadata,
      userId: req.user?._id?.toString() || 'guest',
    },
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new ApiError(400, `Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      // Update order payment status
      await Order.findOneAndUpdate(
        { 'paymentMethod.transactionId': paymentIntent.id },
        { 'paymentMethod.status': 'completed', status: 'processing' }
      );
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { 'paymentMethod.transactionId': paymentIntent.id },
        { 'paymentMethod.status': 'failed' }
      );
      break;
    }
  }

  res.json({ received: true });
});

export const createPaypalOrder = asyncHandler(async (req, res) => {
  // PayPal order creation placeholder
  // In production, use @paypal/checkout-server-sdk
  const { amount } = req.body;

  res.json({
    success: true,
    orderId: `PAYPAL-${Date.now()}`,
    amount,
    message: 'PayPal order created. Configure PayPal SDK for production.',
  });
});

export const capturePaypalOrder = asyncHandler(async (req, res) => {
  const { orderId, paypalOrderId } = req.body;

  // In production, capture the PayPal payment here
  if (orderId) {
    await Order.findByIdAndUpdate(orderId, {
      'paymentMethod.type': 'paypal',
      'paymentMethod.transactionId': paypalOrderId,
      'paymentMethod.status': 'completed',
      status: 'processing',
    });
  }

  res.json({ success: true, message: 'PayPal payment captured' });
});
