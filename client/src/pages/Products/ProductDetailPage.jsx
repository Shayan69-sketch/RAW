import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import { FiHeart, FiTruck, FiRefreshCw, FiShield, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-toastify';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductCard from '../../components/common/ProductCard';
import { ProductDetailSkeleton } from '../../components/common/Loader';
import { useGetProductBySlugQuery, useGetProductsQuery } from '../../services/productApi';
import { useGetProductReviewsQuery } from '../../services/reviewApi';
import { useAddToCartMutation } from '../../services/cartApi';
import { getDiscountPercentage } from '../../utils/formatPrice';
import { getStockStatus, generateSessionId } from '../../utils/helpers';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import { useCurrency } from '../../context/CurrencyContext';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading } = useGetProductBySlugQuery(slug);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();
  const { addItem: addRecentlyViewed } = useRecentlyViewed();
  const { format } = useCurrency();

  const product = data?.product;

  // Track recently viewed
  useEffect(() => {
    if (product) addRecentlyViewed(product);
  }, [product?.slug]);

  const variant = product?.variants?.[selectedVariant];
  const images = variant?.images || [];
  const price = product?.isSale && product?.salePrice ? product.salePrice : product?.basePrice;
  const discount = getDiscountPercentage(product?.basePrice, product?.salePrice);
  const selectedSizeObj = variant?.sizes?.find((s) => s.size === selectedSize);
  const stockStatus = selectedSizeObj ? getStockStatus(selectedSizeObj.stock) : null;

  // Related products
  const { data: relatedData } = useGetProductsQuery(
    { gender: product?.gender, limit: 4 },
    { skip: !product }
  );

  // Reviews
  const { data: reviewsData } = useGetProductReviewsQuery(
    { productId: product?._id },
    { skip: !product }
  );

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    generateSessionId();
    try {
      await addToCart({
        productId: product._id,
        variantId: variant._id,
        size: selectedSize,
        color: variant.color,
        quantity: 1,
      }).unwrap();
      toast.success('Added to bag!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={product.name} description={product.description} />

      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={[
          { label: 'Products', href: '/products' },
          { label: product.gender?.charAt(0).toUpperCase() + product.gender?.slice(1), href: `/products?gender=${product.gender}` },
          { label: product.name },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Thumbs, Zoom]}
              navigation
              zoom
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              className="mb-3 aspect-square"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="swiper-zoom-container">
                    <img src={img.url} alt={img.altText || product.name} className="w-full h-full object-cover" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              slidesPerView={4}
              spaceBetween={8}
              watchSlidesProgress
              className="cursor-pointer"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img.url} alt="" className="w-full aspect-square object-cover border border-border hover:border-primary transition-colors" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xl font-bold ${product.isSale ? 'text-red-600' : ''}`}>
                {format(price)}
              </span>
              {product.isSale && product.salePrice && (
                <>
                  <span className="text-lg text-text-muted line-through">{format(product.basePrice)}</span>
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5">-{discount}%</span>
                </>
              )}
            </div>

            {product.ratings?.count > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-yellow-500">{'★'.repeat(Math.round(product.ratings.average))}</span>
                <span className="text-sm text-text-muted">
                  {product.ratings.average} ({product.ratings.count} reviews)
                </span>
              </div>
            )}

            {/* Color swatches */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest mb-3">
                Color: <span className="font-normal capitalize">{variant?.color}</span>
              </p>
              <div className="flex gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v._id}
                    onClick={() => { setSelectedVariant(idx); setSelectedSize(''); }}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      idx === selectedVariant ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: v.colorHex }}
                    title={v.color}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-widest">Size</p>
                <button className="text-xs underline text-text-muted hover:text-primary">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {variant?.sizes?.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    disabled={!s.isAvailable || s.stock === 0}
                    className={`py-3 border text-sm font-semibold transition-all ${
                      selectedSize === s.size
                        ? 'bg-primary text-white border-primary'
                        : s.isAvailable && s.stock > 0
                        ? 'border-border hover:border-primary'
                        : 'border-border text-text-muted line-through cursor-not-allowed opacity-50'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              {stockStatus && (
                <p className={`text-sm mt-2 ${stockStatus.color} ${stockStatus.urgent ? 'font-semibold animate-pulse' : ''}`}>
                  {stockStatus.text}
                </p>
              )}
            </div>

            {/* Add to bag */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={adding || !selectedSize}
              className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-colors mb-4 ${
                selectedSize
                  ? 'bg-primary text-white hover:bg-primary-light'
                  : 'bg-gray-200 text-text-muted cursor-not-allowed'
              }`}
            >
              {adding ? 'Adding...' : 'Add to Bag'}
            </motion.button>

            <button className="w-full py-3 border border-border text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-bg-alt transition-colors mb-8">
              <FiHeart size={16} /> Add to Wishlist
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              <div className="p-3 border border-border">
                <FiTruck className="mx-auto mb-1.5" size={18} />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Free Shipping 75+</span>
              </div>
              <div className="p-3 border border-border">
                <FiRefreshCw className="mx-auto mb-1.5" size={18} />
                <span className="text-[10px] uppercase tracking-wider font-semibold">30 Day Returns</span>
              </div>
              <div className="p-3 border border-border">
                <FiShield className="mx-auto mb-1.5" size={18} />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Secure Checkout</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-border">
              {[
                { key: 'description', label: 'Description' },
                { key: 'details', label: 'Details & Care' },
                { key: 'reviews', label: `Reviews (${product.ratings?.count || 0})` },
              ].map((tab) => (
                <div key={tab.key} className="border-b border-border">
                  <button
                    onClick={() => setActiveTab(activeTab === tab.key ? '' : tab.key)}
                    className="flex items-center justify-between w-full py-4 text-sm font-semibold uppercase tracking-wider"
                  >
                    {tab.label}
                    <FiChevronDown className={`transition-transform ${activeTab === tab.key ? 'rotate-180' : ''}`} />
                  </button>
                  {activeTab === tab.key && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="pb-4"
                    >
                      {tab.key === 'description' && (
                        <p className="text-sm text-text-light leading-relaxed whitespace-pre-line">{product.description}</p>
                      )}
                      {tab.key === 'details' && (
                        <div className="text-sm text-text-light space-y-3">
                          {product.details && <p className="whitespace-pre-line">{product.details}</p>}
                          {product.careInstructions && (
                            <div>
                              <span className="font-semibold text-primary">Care:</span>
                              <p>{product.careInstructions}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {tab.key === 'reviews' && (
                        <div className="space-y-4">
                          {reviewsData?.reviews?.length > 0 ? (
                            reviewsData.reviews.map((review) => (
                              <div key={review._id} className="border-b border-border pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}</span>
                                  <span className="text-xs text-text-muted">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm font-semibold">{review.title}</p>
                                <p className="text-sm text-text-light mt-1">{review.body}</p>
                                <p className="text-xs text-text-muted mt-2">
                                  {review.user?.firstName} {review.user?.lastName}
                                  {review.isVerifiedPurchase && <span className="text-green-600 ml-2">✓ Verified</span>}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-text-muted">No reviews yet. Be the first!</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedData?.products?.length > 0 && (
          <section className="mb-16">
            <h2 className="section-title mb-8">Complete The Look</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedData.products
                .filter((p) => p.slug !== slug)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile Add to Bag */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-border p-4 z-40">
        <button
          onClick={handleAddToCart}
          disabled={adding || !selectedSize}
          className={`w-full py-3.5 text-sm font-bold uppercase tracking-widest ${
            selectedSize ? 'bg-primary text-white' : 'bg-gray-200 text-text-muted'
          }`}
        >
          {adding ? 'Adding...' : selectedSize ? `Add to Bag — ${format(price)}` : 'Select a Size'}
        </button>
      </div>
    </>
  );
};

export default ProductDetailPage;
