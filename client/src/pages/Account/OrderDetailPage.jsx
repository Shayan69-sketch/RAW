import { useParams, Link } from 'react-router-dom';
import { useGetOrderByIdQuery, useCancelOrderMutation } from '../../services/orderApi';
import { useCurrency } from '../../context/CurrencyContext';
import { ORDER_STATUSES } from '../../utils/constants';
import { toast } from 'react-toastify';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderByIdQuery(id);
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const { format } = useCurrency();

  const order = data?.order;
  const status = ORDER_STATUSES.find((s) => s.value === order?.status);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try { await cancelOrder(id).unwrap(); toast.success('Order cancelled'); } catch (err) { toast.error(err?.data?.message || 'Cannot cancel'); }
  };

  if (isLoading) return <div className="animate-pulse"><div className="h-6 bg-gray-200 w-1/3 mb-4" /><div className="h-40 bg-gray-200" /></div>;
  if (!order) return <p>Order not found</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider">Order {order.orderNumber}</h2>
        {status && <span className={`px-3 py-1 rounded text-xs font-semibold ${status.color}`}>{status.label}</span>}
      </div>
      <p className="text-sm text-text-muted mb-6">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

      {/* Items */}
      <div className="border border-border p-4 mb-6 space-y-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-20 object-cover" />
            <div className="flex-1"><p className="font-semibold text-sm">{item.name}</p><p className="text-xs text-text-muted">{item.color} / {item.size} / Qty: {item.quantity}</p><p className="text-sm font-semibold mt-1">{format(item.priceAtPurchase * item.quantity)}</p></div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-bg-alt p-4 space-y-2 text-sm mb-6">
        <div className="flex justify-between"><span>Subtotal</span><span>{format(order.subtotal)}</span></div>
        {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{format(order.discount)}</span></div>}
        <div className="flex justify-between"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : format(order.shippingCost)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>{format(order.tax)}</span></div>
        <div className="flex justify-between font-bold border-t border-border pt-2"><span>Total</span><span>{format(order.total)}</span></div>
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div className="mb-6"><h3 className="text-sm font-bold uppercase mb-2">Shipping Address</h3><p className="text-sm text-text-light">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p></div>
      )}

      {order.trackingNumber && (
        <div className="mb-6"><h3 className="text-sm font-bold uppercase mb-2">Tracking</h3><p className="text-sm">{order.shippingCarrier}: {order.trackingNumber}</p></div>
      )}

      {['pending', 'processing'].includes(order.status) && (
        <button onClick={handleCancel} disabled={cancelling} className="btn btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
          {cancelling ? 'Cancelling...' : 'Cancel Order'}
        </button>
      )}
    </div>
  );
};

export default OrderDetailPage;
