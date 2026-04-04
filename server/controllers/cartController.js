import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const getCartQuery = (req) => {
  if (req.user) return { user: req.user._id };
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
  if (sessionId) return { sessionId };
  throw new ApiError(400, 'No user or session identifier provided');
};

export const getCart = asyncHandler(async (req, res) => {
  const query = getCartQuery(req);
  let cart = await Cart.findOne(query)
    .populate('items.product', 'name slug basePrice salePrice isSale variants')
    .populate('couponApplied');

  if (!cart) {
    cart = { items: [], couponApplied: null };
  }

  res.json({ success: true, cart });
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, variantId, size, color, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const variant = product.variants.id(variantId);
  if (!variant) throw new ApiError(404, 'Variant not found');

  const sizeObj = variant.sizes.find((s) => s.size === size);
  if (!sizeObj || !sizeObj.isAvailable || sizeObj.stock < quantity) {
    throw new ApiError(400, 'Selected size is not available or out of stock');
  }

  const price = product.isSale && product.salePrice ? product.salePrice : product.basePrice;

  const query = req.user
    ? { user: req.user._id }
    : { sessionId: req.headers['x-session-id'] || req.cookies?.sessionId };

  let cart = await Cart.findOne(query);

  if (!cart) {
    cart = new Cart({
      ...query,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.variantId === variantId &&
      item.size === size
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      variantId,
      size,
      color,
      quantity,
      priceAtAdd: price,
    });
  }

  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name slug basePrice salePrice isSale variants')
    .populate('couponApplied');

  res.json({ success: true, cart });
});

export const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const query = getCartQuery(req);

  let cart = await Cart.findOne(query);
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Item not found in cart');

  if (quantity <= 0) {
    cart.items.pull(req.params.itemId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name slug basePrice salePrice isSale variants')
    .populate('couponApplied');

  res.json({ success: true, cart });
});

export const removeItem = asyncHandler(async (req, res) => {
  const query = getCartQuery(req);

  let cart = await Cart.findOne(query);
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items.pull(req.params.itemId);
  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name slug basePrice salePrice isSale variants')
    .populate('couponApplied');

  res.json({ success: true, cart });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const query = getCartQuery(req);

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon || !coupon.isValid()) {
    throw new ApiError(400, 'Invalid or expired coupon code');
  }

  let cart = await Cart.findOne(query);
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.couponApplied = coupon._id;
  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name slug basePrice salePrice isSale variants')
    .populate('couponApplied');

  res.json({ success: true, cart, message: 'Coupon applied successfully' });
});

export const removeCoupon = asyncHandler(async (req, res) => {
  const query = getCartQuery(req);

  let cart = await Cart.findOne(query);
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.couponApplied = null;
  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name slug basePrice salePrice isSale variants');

  res.json({ success: true, cart, message: 'Coupon removed' });
});
