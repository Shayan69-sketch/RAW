import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';
import { orderConfirmationTemplate, shippingNotificationTemplate } from '../utils/emailTemplates.js';

export const createOrder = asyncHandler(async (req, res) => {
  const {
    items, shippingAddress, billingAddress,
    paymentMethod, guestEmail, couponCode,
  } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, 'No items in order');
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new ApiError(404, `Product not found: ${item.productId}`);

    const variant = product.variants.id(item.variantId);
    if (!variant) throw new ApiError(404, 'Product variant not found');

    const sizeObj = variant.sizes.find((s) => s.size === item.size);
    if (!sizeObj || sizeObj.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name} (${item.size})`);
    }

    const price = product.isSale && product.salePrice ? product.salePrice : product.basePrice;
    const primaryImage = variant.images.find((img) => img.isPrimary) || variant.images[0];

    orderItems.push({
      product: product._id,
      variantId: item.variantId,
      size: item.size,
      color: variant.color,
      quantity: item.quantity,
      priceAtPurchase: price,
      imageUrl: primaryImage?.url || '',
      name: product.name,
    });

    subtotal += price * item.quantity;

    // Decrement stock
    sizeObj.stock -= item.quantity;
    if (sizeObj.stock <= 0) sizeObj.isAvailable = false;
    product.totalSold += item.quantity;
    await product.save();
  }

  // Calculate discount if coupon
  let discount = 0;
  let couponId = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon && coupon.isValid() && subtotal >= coupon.minOrderAmount) {
      if (coupon.type === 'percent') {
        discount = (subtotal * coupon.value) / 100;
      } else {
        discount = coupon.value;
      }
      coupon.usedCount += 1;
      await coupon.save();
      couponId = coupon._id;
    }
  }

  const shippingCost = subtotal >= 75 ? 0 : 5.99;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + shippingCost + tax;

  const order = await Order.create({
    user: req.user ? req.user._id : null,
    guestEmail: guestEmail || '',
    items: orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod,
    coupon: couponId,
    subtotal,
    shippingCost,
    discount,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  });

  // Clear cart
  if (req.user) {
    await Cart.findOneAndDelete({ user: req.user._id });
  }

  // Send confirmation email
  const emailTo = req.user ? req.user.email : guestEmail;
  if (emailTo) {
    sendEmail({
      to: emailTo,
      subject: `Order Confirmed - ${order.orderNumber}`,
      html: orderConfirmationTemplate(order),
    });
  }

  res.status(201).json({ success: true, order });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    orders,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name slug');

  if (!order) throw new ApiError(404, 'Order not found');

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    order.user?._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  res.json({ success: true, order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, shippingCarrier } = req.body;

  const order = await Order.findById(req.params.id).populate('user', 'email firstName');
  if (!order) throw new ApiError(404, 'Order not found');

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (shippingCarrier) order.shippingCarrier = shippingCarrier;

  await order.save();

  // Send shipping notification
  if (status === 'shipped') {
    const emailTo = order.user?.email || order.guestEmail;
    if (emailTo) {
      sendEmail({
        to: emailTo,
        subject: `Your Order Has Shipped - ${order.orderNumber}`,
        html: shippingNotificationTemplate(order),
      });
    }
  }

  res.json({ success: true, order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.user?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to cancel this order');
  }

  if (['shipped', 'delivered'].includes(order.status)) {
    throw new ApiError(400, 'Cannot cancel a shipped or delivered order');
  }

  order.status = 'cancelled';
  await order.save();

  // Restore stock
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.id(item.variantId);
      if (variant) {
        const sizeObj = variant.sizes.find((s) => s.size === item.size);
        if (sizeObj) {
          sizeObj.stock += item.quantity;
          sizeObj.isAvailable = true;
        }
      }
      product.totalSold = Math.max(0, product.totalSold - item.quantity);
      await product.save();
    }
  }

  res.json({ success: true, order });
});
