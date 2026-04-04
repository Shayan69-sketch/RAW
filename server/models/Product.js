import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'], required: true },
  sku: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  isAvailable: { type: Boolean, default: true },
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  altText: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false },
});

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  colorHex: { type: String, required: true },
  images: [imageSchema],
  sizes: [sizeSchema],
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    details: { type: String, default: '' },
    careInstructions: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    sportType: [{ type: String, enum: ['lifting', 'running', 'yoga', 'training', 'everyday'] }],
    tags: [String],
    basePrice: { type: Number, required: true },
    salePrice: { type: Number },
    isSale: { type: Boolean, default: false },
    variants: [variantSchema],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    totalSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

productSchema.index({ category: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isTrending: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
