import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAdminStats = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - Number(period));

  // Total sales
  const totalSalesResult = await Order.aggregate([
    { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
    { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
  ]);

  const totalSales = totalSalesResult[0]?.total || 0;
  const totalOrders = totalSalesResult[0]?.count || 0;

  // Today's orders
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const ordersToday = await Order.countDocuments({ createdAt: { $gte: todayStart } });

  // Total users
  const totalUsers = await User.countDocuments();
  const newUsers = await User.countDocuments({ createdAt: { $gte: daysAgo } });

  // Revenue by day for chart
  const revenueByDay = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: daysAgo },
        status: { $nin: ['cancelled', 'refunded'] },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top products
  const topProducts = await Product.find()
    .sort({ totalSold: -1 })
    .limit(5)
    .select('name basePrice totalSold');

  // Recent orders
  const recentOrders = await Order.find()
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(10);

  // Orders by status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    stats: {
      totalSales,
      totalOrders,
      ordersToday,
      totalUsers,
      newUsers,
      revenueByDay,
      topProducts,
      recentOrders,
      ordersByStatus,
    },
  });
});
