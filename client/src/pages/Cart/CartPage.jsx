import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import FreeShippingBar from '../../components/common/FreeShippingBar';
import ProductCard from '../../components/common/ProductCard';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation, useApplyCouponMutation, useRemoveCouponMutation } from '../../services/cartApi';
import { useGetProductsQuery } from '../../services/productApi';
import { useCurrency } from '../../context/CurrencyContext';
import { useState, useMemo } from 'react';

const CartPage = () => {
  const { data: cartData, isLoading } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const [applyCoupon] = useApplyCouponMutation();
  const [removeCoupon] = useRemoveCouponMutation();
  const [couponCode, setCouponCode] = useState('');
  const { data: relatedData } = useGetProductsQuery({ isTrending: true, limit: 4 });
  const { format } = useCurrency();

  const cart = cartData?.cart;
  const items = cart?.items || [];

  const subtotal = useMemo(() => items.reduce((sum, item) => {
    const price = item.product?.isSale && item.product?.salePrice ? item.product.salePrice : (item.priceAtAdd || item.product?.basePrice || 0);
    return sum + price * item.quantity;
  }, 0), [items]);

  const discount = useMemo(() => cart?.couponApplied
    ? cart.couponApplied.type === 'percent'
      ? (subtotal * cart.couponApplied.value) / 100
      : cart.couponApplied.value
    : 0, [cart?.couponApplied, subtotal]);

  const shipping = subtotal >= 75 ? 0 : 5.99;
  const total = subtotal - discount + shipping;

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    try { await updateItem({ itemId, quantity: newQty }).unwrap(); }
    catch { toast.error('Failed to update quantity'); }
  };

  const handleRemove = async (itemId) => {
    try { await removeItem(itemId).unwrap(); toast.success('Item removed from cart'); }
    catch { toast.error('Failed to remove item'); }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try { await applyCoupon({ code: couponCode }).unwrap(); toast.success('Coupon applied!'); setCouponCode(''); }
    catch (err) { toast.error(err?.data?.message || 'Invalid coupon'); }
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <SEO title="Cart" />
        <h1 className="text-3xl font-bold mb-4">Your Bag Is Empty</h1>
        <p className="text-text-light mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <SEO title="Cart" />
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumb items={[{ label: 'Cart' }]} />
        <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight mb-8">Your Bag ({items.length})</h1>
        <FreeShippingBar subtotal={subtotal} />

        <div className="lg:flex lg:gap-10">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="space-y-6">
              {items.map((item) => {
                const product = item.product;
                const variant = product?.variants?.find((v) => v._id === item.variantId);
                const image = variant?.images?.[0]?.url || '';
                const price = product?.isSale && product?.salePrice ? product.salePrice : item.priceAtAdd;

                return (
                  <div key={item._id} className="flex gap-4 pb-6 border-b border-border">
                    <Link to={`/products/${product?.slug}`} className="w-24 h-32 flex-shrink-0">
                      <img src={image} alt={product?.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/products/${product?.slug}`} className="font-semibold text-sm hover:underline">{product?.name}</Link>
                          <p className="text-xs text-text-muted mt-0.5">{item.color} / {item.size}</p>
                        </div>
                        <p className="font-semibold text-sm">{format(price * item.quantity)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border">
                          <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} className="p-2 hover:bg-bg-alt"><FiMinus size={14} /></button>
                          <span className="px-4 py-2 text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} className="p-2 hover:bg-bg-alt"><FiPlus size={14} /></button>
                        </div>
                        <button onClick={() => handleRemove(item._id)} className="p-2 text-text-muted hover:text-red-600 transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 mt-8 lg:mt-0">
            <div className="bg-bg-alt p-6 sticky top-32">
              <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{format(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount ({cart.couponApplied.code})</span><span>-{format(discount)}</span></div>}
                <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : format(shipping)}</span></div>
                <div className="border-t border-border pt-3 flex justify-between font-bold"><span>Total</span><span>{format(total)}</span></div>
              </div>

              {/* Coupon */}
              <form onSubmit={handleApplyCoupon} className="mb-6">
                {cart?.couponApplied ? (
                  <div className="flex items-center justify-between bg-green-50 px-3 py-2 text-sm">
                    <span className="text-green-700 font-semibold">{cart.couponApplied.code}</span>
                    <button onClick={() => removeCoupon()} className="text-red-500 text-xs font-semibold">Remove</button>
                  </div>
                ) : (
                  <div className="flex">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Promo code" className="flex-1 px-3 py-2.5 border border-border text-sm focus:outline-none" />
                    <button type="submit" className="px-4 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider">Apply</button>
                  </div>
                )}
              </form>

              <Link to="/checkout" className="block w-full py-4 bg-primary text-white text-center text-sm font-bold uppercase tracking-widest hover:bg-primary-light transition-colors">
                Secure Checkout
              </Link>
              <p className="text-center text-[10px] text-text-muted mt-3 uppercase tracking-wider">🔒 Secure SSL Encrypted Checkout</p>
            </div>
          </div>
        </div>

        {relatedData?.products?.length > 0 && (
          <section className="mt-16 mb-8">
            <h2 className="section-title mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedData.products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default CartPage;