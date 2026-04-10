import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import { useGetCartQuery } from '../../services/cartApi';
import { useCreateOrderMutation } from '../../services/orderApi';
import { useCreateStripeIntentMutation } from '../../services/paymentApi';
import { useAuth } from '../../hooks/useAuth';
import { useCurrency } from '../../context/CurrencyContext';

const CheckoutPage = () => {
  const { user, isLoggedIn } = useAuth();
  const { data: cartData } = useGetCartQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [createStripeIntent] = useCreateStripeIntentMutation();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [step, setStep] = useState(1);

  const [contact, setContact] = useState({ email: user?.email || '', phone: '' });
  const [shipping, setShipping] = useState({ street: '', city: '', state: '', zip: '', country: 'US' });
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const cart = cartData?.cart;
  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.priceAtAdd || item.product?.basePrice || 0) * item.quantity, 0);
  const shippingCost = subtotal >= 75 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    try {
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        variantId: item.variantId,
        size: item.size,
        quantity: item.quantity,
      }));

      const order = await createOrder({
        items: orderItems,
        shippingAddress: shipping,
        billingAddress: shipping,
        paymentMethod: { type: paymentMethod },
        guestEmail: !isLoggedIn ? contact.email : undefined,
      }).unwrap();

      toast.success('Order placed successfully!');
      navigate(`/account/orders/${order.order._id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to place order');
    }
  };

  return (
    <>
      <SEO title="Checkout" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10 border-b border-border pb-6">
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase">RAWTHREAD</h1>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">Secure Checkout</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10 text-sm">
          {['Contact', 'Shipping', 'Payment', 'Review'].map((s, idx) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Allow going back to completed steps, but not forward to uncompleted
                  if (idx + 1 <= step) setStep(idx + 1);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= idx + 1
                    ? 'bg-primary text-white cursor-pointer hover:bg-primary-light'
                    : 'bg-gray-200 text-text-muted cursor-not-allowed'
                }`}
              >
                {step > idx + 1 ? '✓' : idx + 1}
              </button>
              <span className={`hidden sm:inline ${step === idx + 1 ? 'font-semibold' : 'text-text-muted'}`}>{s}</span>
              {idx < 3 && <div className={`w-8 h-px ${step > idx + 1 ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="lg:flex lg:gap-10">
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4">Contact Information</h2>
                <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Email address" className="input-field" required />
                <button onClick={() => setStep(2)} className="btn btn-primary w-full py-4">Continue to Shipping</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold uppercase tracking-wider">Shipping Address</h2>
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors">
                    <FiArrowLeft size={12} />
                    Back
                  </button>
                </div>
                <input placeholder="Street Address" value={shipping.street} onChange={(e) => setShipping({ ...shipping, street: e.target.value })} className="input-field" required />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="input-field" required />
                  <input placeholder="State" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="ZIP Code" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} className="input-field" required />
                  <input placeholder="Country" value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} className="input-field" />
                </div>
                <button onClick={() => shipping.street ? setStep(3) : toast.error('Please fill in address')} className="btn btn-primary w-full py-4">Continue to Payment</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold uppercase tracking-wider">Payment Method</h2>
                  <button onClick={() => setStep(2)} className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors">
                    <FiArrowLeft size={12} />
                    Back
                  </button>
                </div>
                <label className={`flex items-center gap-3 p-4 border cursor-pointer ${paymentMethod === 'stripe' ? 'border-primary bg-blue-50' : 'border-border'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
                  <span className="font-semibold text-sm">Credit / Debit Card (Stripe)</span>
                </label>
                <label className={`flex items-center gap-3 p-4 border cursor-pointer ${paymentMethod === 'paypal' ? 'border-primary bg-blue-50' : 'border-border'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                  <span className="font-semibold text-sm">PayPal</span>
                </label>
                <p className="text-xs text-text-muted">🔒 Payment will be processed securely.</p>
                <button onClick={() => setStep(4)} className="btn btn-primary w-full py-4">Review Order</button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold uppercase tracking-wider">Review Your Order</h2>
                  <button onClick={() => setStep(3)} className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors">
                    <FiArrowLeft size={12} />
                    Back
                  </button>
                </div>

                {/* Contact - editable */}
                <div className="border border-border p-4 group hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase">Contact</h3>
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 text-[10px] font-semibold text-text-muted hover:text-primary transition-colors uppercase tracking-wider"
                    >
                      <FiEdit2 size={10} />
                      Edit
                    </button>
                  </div>
                  <p className="text-sm">{contact.email}</p>
                </div>

                {/* Shipping Address - editable */}
                <div className="border border-border p-4 group hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase">Ship To</h3>
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1 text-[10px] font-semibold text-text-muted hover:text-primary transition-colors uppercase tracking-wider"
                    >
                      <FiEdit2 size={10} />
                      Edit
                    </button>
                  </div>
                  <p className="text-sm">{shipping.street}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                </div>

                {/* Payment Method - editable */}
                <div className="border border-border p-4 group hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase">Payment</h3>
                    <button
                      onClick={() => setStep(3)}
                      className="flex items-center gap-1 text-[10px] font-semibold text-text-muted hover:text-primary transition-colors uppercase tracking-wider"
                    >
                      <FiEdit2 size={10} />
                      Edit
                    </button>
                  </div>
                  <p className="text-sm capitalize">{paymentMethod === 'stripe' ? 'Credit / Debit Card (Stripe)' : 'PayPal'}</p>
                </div>

                <button onClick={handlePlaceOrder} disabled={isLoading} className="btn btn-primary w-full py-4 text-base">
                  {isLoading ? 'Processing...' : `Place Order — ${format(total)}`}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-80 mt-8 lg:mt-0">
            <div className="bg-bg-alt p-5 sticky top-20">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="relative">
                      <img
                        src={item.product?.variants?.find((v) => v._id === item.variantId)?.images?.[0]?.url || ''}
                        alt=""
                        className="w-14 h-18 object-cover"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{item.product?.name}</p>
                      <p className="text-[10px] text-text-muted">{item.color} / {item.size}</p>
                    </div>
                    <span className="text-xs font-semibold">{format(item.priceAtAdd * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{format(subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : format(shippingCost)}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>Total</span><span>{format(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;