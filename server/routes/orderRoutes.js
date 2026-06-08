const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { requireActiveTenant } = require('../middleware/tenantMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, requireActiveTenant);

router.post('/', authorize('customer'), ctrl.placeOrder);
router.get('/', authorize('tenant_admin', 'platform_admin'), ctrl.getTenantOrders);
router.get('/my', authorize('customer'), ctrl.getMyOrders);
router.get('/:id', ctrl.getOrder);
router.put('/:id/status', authorize('tenant_admin', 'platform_admin'), ctrl.updateOrderStatus);
router.post('/:id/cancel', authorize('customer'), ctrl.cancelOrder);

module.exports = router;
