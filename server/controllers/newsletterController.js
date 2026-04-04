import Newsletter from '../models/Newsletter.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (existing.isActive) {
      throw new ApiError(400, 'Email is already subscribed');
    }
    existing.isActive = true;
    await existing.save();
    return res.json({ success: true, message: 'Re-subscribed successfully' });
  }

  await Newsletter.create({ email });
  res.status(201).json({ success: true, message: 'Subscribed successfully' });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const subscriber = await Newsletter.findOne({ email });
  if (!subscriber) {
    throw new ApiError(404, 'Email not found');
  }

  subscriber.isActive = false;
  await subscriber.save();

  res.json({ success: true, message: 'Unsubscribed successfully' });
});
