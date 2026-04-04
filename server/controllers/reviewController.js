import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getProductReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const total = await Review.countDocuments({
    product: req.params.productId,
    isApproved: true,
  });

  const reviews = await Review.find({
    product: req.params.productId,
    isApproved: true,
  })
    .populate('user', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    reviews,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const existingReview = await Review.findOne({
    product: productId,
    user: req.user._id,
  });
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this product');
  }

  // Check if verified purchase
  const order = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    status: 'delivered',
  });

  const review = await Review.create({
    ...req.body,
    product: productId,
    user: req.user._id,
    isVerifiedPurchase: !!order,
  });

  res.status(201).json({ success: true, review });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this review');
  }

  Object.assign(review, req.body);
  await review.save();

  res.json({ success: true, review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) throw new ApiError(404, 'Review not found');
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Not authorized to delete this review');
  }

  await Review.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Review deleted' });
});

export const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  if (!review) throw new ApiError(404, 'Review not found');

  res.json({ success: true, review });
});
