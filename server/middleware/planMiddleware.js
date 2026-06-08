/**
 * Checks that the tenant's plan includes a specific feature.
 * Usage: requireFeature('analyticsAccess')
 */
const requireFeature = (featureKey) => async (req, res, next) => {
  try {
    if (req.user.role === 'platform_admin') return next();

    const tenant = req.tenant; // set by requireActiveTenant
    if (!tenant) return res.status(403).json({ error: 'Tenant context missing' });

    const features = tenant.planFeatures;
    if (!features[featureKey]) {
      return res.status(403).json({
        error: `Feature "${featureKey}" is not available on your current plan (${tenant.plan}). Please upgrade.`,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requireFeature };
