import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../../services/orderApi';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUSES } from '../../utils/constants';

const OrdersPage = () => {
  const { data, isLoading } = useGetMyOrdersQuery();

  const getStatusBadge = (status) => {
    const s = ORDER_STATUSES.find((o) => o.value === status);
    return s ? <span className={`text-xs font-semibold px-2 py-1 rounded ${s.color}`}>{s.label}</span> : status;
  };

  if (isLoading) return <div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-200" />)}</div>;

  return (
    <div>
      <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Order History</h2>
      {data?.orders?.length === 0 ? (
        <div className="text-center py-12 bg-bg-alt"><p className="text-text-muted mb-4">No orders yet</p><Link to="/products" className="btn btn-primary">Start Shopping</Link></div>
      ) : (
        <div className="space-y-4">
          {data?.orders?.map((order) => (
            <Link key={order._id} to={`/account/orders/${order._id}`} className="block border border-border p-4 hover:bg-bg-alt transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{order.orderNumber}</span>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center justify-between text-sm text-text-muted">
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
              </div>
              <div className="flex gap-2 mt-3">
                {order.items.slice(0, 4).map((item, idx) => (
                  <img key={idx} src={item.imageUrl} alt={item.name} className="w-12 h-16 object-cover" />
                ))}
                {order.items.length > 4 && <span className="text-xs text-text-muted self-center">+{order.items.length - 4}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
