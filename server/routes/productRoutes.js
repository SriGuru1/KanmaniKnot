const router = require('express').Router();
const ctrl = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { requireActiveTenant } = require('../middleware/tenantMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', ctrl.listProducts);
router.get('/:id', ctrl.getProduct);
router.post('/', protect, requireActiveTenant, authorize('tenant_admin', 'platform_admin'), ctrl.createProduct);
router.put('/:id', protect, requireActiveTenant, authorize('tenant_admin', 'platform_admin'), ctrl.updateProduct);
router.delete('/:id', protect, requireActiveTenant, authorize('tenant_admin', 'platform_admin'), ctrl.deleteProduct);
router.post('/:id/images', protect, requireActiveTenant, authorize('tenant_admin', 'platform_admin'), upload.array('images', 10), ctrl.uploadImages);

module.exports = router;
