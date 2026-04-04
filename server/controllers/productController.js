import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getProducts = asyncHandler(async (req, res) => {
  const {
    category, gender, color, size, minPrice, maxPrice,
    sort, page = 1, limit = 24, search, sport,
    isFeatured, isTrending, isBestSeller, isSale,
  } = req.query;

  const query = {};

  if (category) query.category = category;
  if (gender) query.gender = gender;
  if (sport) query.sportType = { $in: sport.split(',') };
  if (isFeatured) query.isFeatured = isFeatured === 'true';
  if (isTrending) query.isTrending = isTrending === 'true';
  if (isBestSeller) query.isBestSeller = isBestSeller === 'true';
  if (isSale) query.isSale = isSale === 'true';

  if (color) {
    query['variants.color'] = { $regex: color, $options: 'i' };
  }
  if (size) {
    query['variants.sizes.size'] = size;
  }
  if (minPrice || maxPrice) {
    query.basePrice = {};
    if (minPrice) query.basePrice.$gte = Number(minPrice);
    if (maxPrice) query.basePrice.$lte = Number(maxPrice);
  }
  if (search) {
    query.$text = { $search: search };
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price-asc') sortOption = { basePrice: 1 };
  if (sort === 'price-desc') sortOption = { basePrice: -1 };
  if (sort === 'best-sellers') sortOption = { totalSold: -1 };
  if (sort === 'rating') sortOption = { 'ratings.average': -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category', 'name slug');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json({ success: true, product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json({ success: true, message: 'Product deleted' });
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Images will be uploaded via the upload route and URLs stored
  const { variantId, images } = req.body;

  const variant = product.variants.id(variantId);
  if (!variant) {
    throw new ApiError(404, 'Variant not found');
  }

  variant.images.push(...images);
  await product.save();

  res.json({ success: true, product });
});
