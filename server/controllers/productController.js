const productService = require('../services/productService');
const Tenant = require('../models/Tenant');

exports.listProducts = async (req, res, next) => {
  try {
    let tenantId = req.user?.tenantId || req.query.tenantId;
    if (!tenantId) {
      const defaultTenant = await Tenant.findOne();
      if (defaultTenant) tenantId = defaultTenant._id;
    }
    const result = await productService.listProducts({ tenantId, ...req.query });
    res.json(result);
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    let tenantId = req.user?.tenantId || req.query.tenantId;
    if (!tenantId) {
      const defaultTenant = await Tenant.findOne();
      if (defaultTenant) tenantId = defaultTenant._id;
    }
    const product = await productService.getProduct(req.params.id, tenantId);
    res.json({ product });
  } catch (err) { next(err); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct({ ...req.body, tenantId: req.user.tenantId });
    res.status(201).json({ product });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.user.tenantId, req.body);
    res.json({ product });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.softDeleteProduct(req.params.id, req.user.tenantId);
    res.json({ message: 'Product deactivated' });
  } catch (err) { next(err); }
};

exports.uploadImages = async (req, res, next) => {
  try {
    const imageUrls = req.files.map((f) => f.path);
    const product = await productService.updateProduct(req.params.id, req.user.tenantId, { $push: { images: { $each: imageUrls } } });
    res.json({ imageUrls, product });
  } catch (err) { next(err); }
};
