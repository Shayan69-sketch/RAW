import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// --- Profile ---
export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { firstName, lastName, email },
    { new: true, runValidators: true }
  );
  res.json({ success: true, user });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

// --- Addresses ---
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({ success: true, addresses: user.addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);

  if (!address) throw new ApiError(404, 'Address not found');

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  Object.assign(address, req.body);
  await user.save();

  res.json({ success: true, addresses: user.addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.pull(req.params.id);
  await user.save();

  res.json({ success: true, addresses: user.addresses });
});

// --- Wishlist ---
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist.product');
  res.json({ success: true, wishlist: user.wishlist });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const exists = user.wishlist.find(
    (item) => item.product.toString() === req.params.productId
  );

  if (exists) throw new ApiError(400, 'Product already in wishlist');

  user.wishlist.push({
    product: req.params.productId,
    variantId: req.body.variantId || '',
  });

  await user.save();

  const updated = await User.findById(req.user._id).populate('wishlist.product');
  res.json({ success: true, wishlist: updated.wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(
    (item) => item.product.toString() !== req.params.productId
  );
  await user.save();

  const updated = await User.findById(req.user._id).populate('wishlist.product');
  res.json({ success: true, wishlist: updated.wishlist });
});

// --- Admin User Management ---
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const total = await User.countDocuments();
  const users = await User.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    users,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, user });
});

export const toggleUserBan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  // Simple ban by updating role or adding a flag
  user.role = user.role === 'banned' ? 'user' : 'banned';
  await user.save();

  res.json({ success: true, user });
});
