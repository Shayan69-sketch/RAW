import { Link } from 'react-router-dom';
import { useState, memo } from 'react';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setQuickViewProduct } from '../../features/ui/uiSlice';
import { getDiscountPercentage } from '../../utils/formatPrice';
import { getStockStatus } from '../../utils/helpers';
import { useCurrency } from '../../context/CurrencyContext';

const ProductCard = memo(({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const { format } = useCurrency();

  if (!product) return null;

  const variant = product.variants?.[selectedVariant] || product.variants?.[0];
  const primaryImage = variant?.images?.find((img) => img.isPrimary) || variant?.images?.[0];
  const secondaryImage = variant?.images?.[1] || primaryImage;
  const price = product.isSale && product.salePrice ? product.salePrice : product.basePrice;
  const discount = getDiscountPercentage(product.basePrice, product.salePrice);
  const minStock = variant?.sizes?.reduce((min, s) => Math.min(min, s.stock), Infinity) || 0;
  const stockStatus = getStockStatus(minStock);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden mb-2 sm:mb-3 aspect-[3/4] rounded-lg sm:rounded-none">
        <img
          src={isHovered && secondaryImage ? secondaryImage.url : primaryImage?.url}
          alt={primaryImage?.altText || product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.isSale && discount > 0 && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 sm:py-1 uppercase rounded-sm">
            -{discount}%
          </span>
        )}
        {stockStatus.urgent && (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-sm">
            {stockStatus.text}
          </span>
        )}
        {/* Desktop hover actions */}
        <div className={`hidden sm:flex absolute bottom-0 left-0 right-0 p-3 gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(setQuickViewProduct(product)); }}
            className="flex-1 bg-white text-primary py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 rounded"
          >
            <FiEye size={14} /> Quick View
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="bg-white text-primary p-2.5 hover:bg-primary hover:text-white transition-colors rounded"
          >
            <FiHeart size={16} />
          </button>
        </div>
      </Link>

      {/* Color swatches */}
      {product.variants?.length > 1 && (
        <div className="flex gap-1.5 mb-1.5">
          {product.variants.map((v, idx) => (
            <button
              key={v._id || idx}
              onClick={() => setSelectedVariant(idx)}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all ${idx === selectedVariant ? 'border-primary scale-125' : 'border-gray-300'}`}
              style={{ backgroundColor: v.colorHex }}
              title={v.color}
            />
          ))}
        </div>
      )}

      {/* Info */}
      <Link to={`/products/${product.slug}`}>
        <h3 className="text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1 line-clamp-2 group-hover:underline">{product.name}</h3>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`text-xs sm:text-sm font-bold ${product.isSale ? 'text-red-600' : ''}`}>
            {format(price)}
          </span>
          {product.isSale && product.salePrice && (
            <span className="text-xs text-text-muted line-through">{format(product.basePrice)}</span>
          )}
        </div>
        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
            <span className="text-yellow-500 text-[10px] sm:text-xs">{'★'.repeat(Math.round(product.ratings.average))}</span>
            <span className="text-[10px] sm:text-xs text-text-muted">({product.ratings.count})</span>
          </div>
        )}
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;