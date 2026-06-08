const Tenant = require('../models/Tenant');

/**
 * Validates that the tenant exists and is in an active/trial state.
 * Must run after protect middleware.
 */
const requireActiveTenant = async (req, res, next) => {
  try {
    if (req.user.role === 'platform_admin') return next(); // platform_admin bypasses

    const tenant = await Tenant.findById(req.user.tenantId).select('status plan');
    if (!tenant) {
      return res.status(403).json({ error: 'Tenant not found' });
    }
    if (!['active', 'trial'].includes(tenant.status)) {
      return res.status(403).json({ error: `Tenant account is ${tenant.status}` });
    }
    req.tenant = tenant;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requireActiveTenant };
