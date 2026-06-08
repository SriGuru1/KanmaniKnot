const analyticsService = require('../services/analyticsService');

exports.getDashboard = async (req, res, next) => {
  try {
    const { from, to, granularity } = req.query;
    const data = await analyticsService.getDashboardAnalytics({
      tenantId: req.user.tenantId,
      from, to, granularity,
    });
    res.json(data);
  } catch (err) { next(err); }
};
