const router = require('express').Router();
const ctrl = require('../controllers/tenantController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('tenant_admin', 'platform_admin'));
router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);

module.exports = router;
