const mongoose = require('mongoose');
const Order = require('../models/Order');

/**
 * Revenue + order analytics aggregation pipeline
 * granularity: 'daily' | 'weekly' | 'monthly'
 */
const getDashboardAnalytics = async ({ tenantId, from, to, granularity = 'daily' }) => {
  const tid = new mongoose.Types.ObjectId(tenantId);
  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to)   dateFilter.$lte = new Date(to);

  const matchStage = {
    $match: {
      tenantId: tid,
      status: { $in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
      ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
    },
  };

  const dateGroupFormats = {
    daily:   { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
    weekly:  { $dateToString: { format: '%Y-W%V',   date: '$createdAt' } },
    monthly: { $dateToString: { format: '%Y-%m',    date: '$createdAt' } },
  };

  const [revenueTrend, topProducts, orderVolume] = await Promise.all([
    // Revenue trend
    Order.aggregate([
      matchStage,
      { $group: {
          _id: dateGroupFormats[granularity] || dateGroupFormats.daily,
          revenue: { $sum: '$totalAmount' },
          orders:  { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
    ]),

    // Top 10 products by revenue
    Order.aggregate([
      matchStage,
      { $unwind: '$items' },
      { $group: {
          _id: '$items.productId',
          name:     { $first: '$items.name' },
          revenue:  { $sum: { $multiply: ['$items.price', '$items.qty'] } },
          unitsSold:{ $sum: '$items.qty' },
      }},
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]),

    // Order status breakdown
    Order.aggregate([
      { $match: { tenantId: tid } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  return { revenueTrend, topProducts, orderVolume };
};

module.exports = { getDashboardAnalytics };
