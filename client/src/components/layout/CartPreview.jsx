import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiX, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from '../../services/cartApi';
import { formatPrice } from '../../utils/formatPrice';
import { toast } from 'react-toastify';

const CartPreview = ({ isOpen, onClose }) => {
  const { data: cartData, isLoading } = useGetCartQuery(undefined, { skip: !isOpen });
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const ref = useRef(null);

  const cart = cartData?.cart;
  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.isSale && item.product?.salePrice
      ? item.product.salePrice
      : (item.priceAtAdd || item.product?.basePrice || 0);
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 75 ? 0 : 5.99;

  const handleQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    try { await updateItem({ itemId, quantity: newQty }).unwrap(); }
    catch { toast.error('Failed to update'); }
  };

  const handleRemove = async (itemId) => {
    try { await removeItem(itemId).unwrap(); }
    catch { toast.error('Failed to remove'); }
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiShoppingBag size={18} />
                <h2 className="font-bold text-sm uppercase tracking-widest">
                  Your Bag {items.length > 0 && <span className="text-gray-400">({items.length})</span>}
                </h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <FiX size={16} />
              </button>
            </div>

            {/* Free shipping bar */}
            {subtotal > 0 && subtotal < 75 && (
              <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-gray-600">
                    Add <span className="font-bold">{formatPrice(75 - subtotal)}</span> more for free shipping
                  </p>
                  <span className="text-xs">🚚</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 75) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {subtotal >= 75 && (
              <div className="px-5 py-2 bg-green-50 border-b border-green-100">
                <p className="text-xs text-green-700 font-semibold text-center">🎉 You've unlocked free shipping!</p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-5">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-20 bg-gray-100 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-2 bg-gray-50 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingBag size={24} className="text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Your bag is empty</p>
                  <p className="text-sm text-gray-400 mb-6">Add items to get started</p>
                  <Link
                    to="/products"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const product = item.product;
                    const variant = product?.variants?.find(v => v._id === item.variantId);
                    const image = variant?.images?.find(i => i.isPrimary)?.url || variant?.images?.[0]?.url || '';
                    const price = product?.isSale && product?.salePrice ? product.salePrice : item.priceAtAdd;

                    return (
                      <div key={item._id} className="flex gap-3 group">
                        <Link to={`/products/${product?.slug}`} onClick={onClose} className="shrink-0">
                          <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
                            <img src={image} alt={product?.name} className="w-full h-full object-cover" />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <Link
                              to={`/products/${product?.slug}`}
                              onClick={onClose}
                              className="text-xs font-semibold text-gray-900 hover:underline leading-tight line-clamp-2"
                            >
                              {product?.name}
                            </Link>
                            <button
                              onClick={() => handleRemove(item._id)}
                              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all shrink-0 opacity-0 group-hover:opacity-100"
                            >
                              <FiX size={10} />
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">{item.color} / {item.size}</p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleQty(item._id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <FiMinus size={10} />
                              </button>
                              <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQty(item._id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <FiPlus size={10} />
                              </button>
                            </div>
                            <span className="text-xs font-bold text-gray-900">{formatPrice(price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600 font-semibold">FREE</span> : formatPrice(shipping)}</span>
                  </div>
                  {cart?.couponApplied && (
                    <div className="flex justify-between text-xs text-green-600">
                      <span>Coupon ({cart.couponApplied.code})</span>
                      <span>
                        -{cart.couponApplied.type === 'percent'
                          ? `${cart.couponApplied.value}%`
                          : formatPrice(cart.couponApplied.value)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(subtotal + shipping)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Checkout <FiArrowRight size={13} />
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex items-center justify-center w-full py-2.5 border border-gray-200 text-xs font-semibold text-gray-600 rounded-xl hover:border-gray-400 hover:text-black transition-all"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPreview;