const Tenant = require('../models/Tenant');

exports.listTenants = async (req, res, next) => {
  try {
    const { status, plan, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (plan)   filter.plan = plan;
    const skip = (page - 1) * limit;
    const [tenants, total] = await Promise.all([
      Tenant.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Tenant.countDocuments(filter),
    ]);
    res.json({ tenants, total });
  } catch (err) { next(err); }
};

exports.updateTenantStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json({ tenant });
  } catch (err) { next(err); }
};
