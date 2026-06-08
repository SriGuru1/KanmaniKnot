/**
 * Role hierarchy: platform_admin > tenant_admin > customer
 * Usage: authorize('tenant_admin', 'platform_admin')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

module.exports = { authorize };
