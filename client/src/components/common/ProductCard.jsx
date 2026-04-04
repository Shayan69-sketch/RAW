import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setQuickViewProduct } from '../../features/ui/uiSlice';
import { formatPrice, getDiscountPercentage } from '../../utils/formatPrice';
import { getStockStatus } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  if (!product) return null;

  const variant = product.variants?.[selectedVariant] || product.variants?.[0];
  const primaryImage = variant?.images?.find((img) => img.isPrimary) || variant?.images?.[0];
  const secondaryImage = variant?.images?.[1] || primaryImage;
  const price = product.isSale && product.salePrice ? product.salePrice : product.basePrice;
  const discount = getDiscountPercentage(product.basePrice, product.salePrice);

  // Get minimum stock across sizes for the variant
  const minStock = variant?.sizes?.reduce((min, s) => Math.min(min, s.stock), Infinity) || 0;
  const stockStatus = getStockStatus(minStock);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden mb-3 aspect-[3/4]">
        <img
          src={isHovered && secondaryImage ? secondaryImage.url : primaryImage?.url}
          alt={primaryImage?.altText || product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Sale badge */}
        {product.isSale && discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase">
            -{discount}%
          </span>
        )}

        {/* Low stock */}
        {stockStatus.urgent && (
          <span className="absolute top-3 right-3 bg-orange-600 text-white text-[10px] font-bold px-2 py-1">
            {stockStatus.text}
          </span>
        )}

        {/* Quick actions */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 flex gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(setQuickViewProduct(product));
            }}
            className="flex-1 bg-white text-primary py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <FiEye size={14} /> Quick View
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add to wishlist handled elsewhere
            }}
            className="bg-white text-primary p-2.5 hover:bg-primary hover:text-white transition-colors"
          >
            <FiHeart size={16} />
          </button>
        </div>
      </Link>

      {/* Color swatches */}
      {product.variants?.length > 1 && (
        <div className="flex gap-1.5 mb-2">
          {product.variants.map((v, idx) => (
            <button
              key={v._id || idx}
              onClick={() => setSelectedVariant(idx)}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                idx === selectedVariant ? 'border-primary scale-125' : 'border-gray-300'
              }`}
              style={{ backgroundColor: v.colorHex }}
              title={v.color}
            />
          ))}
        </div>
      )}

      {/* Info */}
      <Link to={`/products/${product.slug}`}>
        <h3 className="text-sm font-semibold mb-1 group-hover:underline">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${product.isSale ? 'text-red-600' : ''}`}>
            {formatPrice(price)}
          </span>
          {product.isSale && product.salePrice && (
            <span className="text-sm text-text-muted line-through">{formatPrice(product.basePrice)}</span>
          )}
        </div>
        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-500 text-xs">{'★'.repeat(Math.round(product.ratings.average))}</span>
            <span className="text-xs text-text-muted">({product.ratings.count})</span>
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default ProductCard;
