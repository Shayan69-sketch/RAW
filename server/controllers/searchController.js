import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const searchProducts = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 24 } = req.query;

  if (!q || q.trim().length === 0) {
    return res.json({ success: true, products: [], pagination: { total: 0 } });
  }

  const skip = (Number(page) - 1) * Number(limit);

  // Text search + regex fallback
  let query;
  try {
    query = { $text: { $search: q } };
    const total = await Product.countDocuments(query);
    const products = await Product.find(query, { score: { $meta: 'textScore' } })
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(Number(limit));

    return res.json({
      success: true,
      products,
      query: q,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    // Fallback to regex search
    const regex = new RegExp(q, 'i');
    query = {
      $or: [
        { name: regex },
        { description: regex },
        { tags: regex },
      ],
    };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .skip(skip)
      .limit(Number(limit));

    return res.json({
      success: true,
      products,
      query: q,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
});
