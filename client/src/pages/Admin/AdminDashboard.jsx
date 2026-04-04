import { useGetAdminStatsQuery } from '../../services/adminApi';
import { formatPrice } from '../../utils/formatPrice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiDollarSign, FiShoppingCart, FiUsers, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  const { data, isLoading } = useGetAdminStatsQuery({ period: 30 });
  const stats = data?.stats;

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats?.totalSales || 0), icon: FiDollarSign, bg: 'bg-green-50 text-green-600' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FiShoppingCart, bg: 'bg-blue-50 text-blue-600' },
    { label: 'Orders Today', value: stats?.ordersToday || 0, icon: FiTrendingUp, bg: 'bg-purple-50 text-purple-600' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, bg: 'bg-orange-50 text-orange-600' },
  ];

  if (isLoading) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-border p-5">
            <div className={`w-10 h-10 rounded flex items-center justify-center mb-3 ${card.bg}`}>
              <card.icon size={20} />
            </div>
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-border p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Revenue (Last 30 Days)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.revenueByDay || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="_id" tickFormatter={(val) => val?.slice(-5)} tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(val) => `$${val}`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [formatPrice(value), 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#181818" fill="#181818" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats?.recentOrders?.slice(0, 5).map((order) => (
              <div key={order._id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-xs text-text-muted">{order.user?.firstName} {order.user?.lastName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-xs text-text-muted capitalize">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-border p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Top Products</h2>
          <div className="space-y-3">
            {stats?.topProducts?.map((product, idx) => (
              <div key={product._id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-text-muted">#{idx + 1}</span>
                  <p className="font-semibold">{product.name}</p>
                </div>
                <p className="text-xs text-text-muted">{product.totalSold} sold</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
