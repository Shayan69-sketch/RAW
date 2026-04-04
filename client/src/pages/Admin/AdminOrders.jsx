import { useState } from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../services/orderApi';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUSES } from '../../utils/constants';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useGetAllOrdersQuery({ status: statusFilter || undefined, limit: 50 });
  const [updateStatus] = useUpdateOrderStatusMutation();

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success('Order status updated');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider">Orders</h2>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-border text-sm bg-white">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white" />)}</div>
      ) : (
        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg-alt border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Order</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Total</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.orders?.map((order) => (
                <tr key={order._id} className="border-b border-border hover:bg-bg-alt">
                  <td className="px-4 py-3 font-semibold">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestEmail}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="px-2 py-1 text-xs border border-border bg-white cursor-pointer">
                      {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
