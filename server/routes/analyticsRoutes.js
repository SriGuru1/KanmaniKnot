const router = require('express').Router();
const ctrl = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { requireActiveTenant } = require('../middleware/tenantMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { requireFeature } = require('../middleware/planMiddleware');

router.get('/dashboard', protect, requireActiveTenant, authorize('tenant_admin', 'platform_admin'), requireFeature('analyticsAccess'), ctrl.getDashboard);

module.exports = router;
