const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('platform_admin'));
router.get('/tenants', ctrl.listTenants);
router.put('/tenants/:id/status', ctrl.updateTenantStatus);

module.exports = router;
