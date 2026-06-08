const Product = require('../models/Product');
const Review = require('../models/Review');

const DEFAULT_PAGE_SIZE = 20;

const listProducts = async ({ tenantId, page = 1, limit = DEFAULT_PAGE_SIZE, category, minPrice, maxPrice, search, isActive = true }) => {
  const filter = { tenantId, isActive };
  if (category) filter.category = category;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.basePrice = {};
    if (minPrice !== undefined) filter.basePrice.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.basePrice.$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(filter),
  ]);
  return { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

const getProduct = async (productId, tenantId) => {
  const product = await Product.findOne({ _id: productId, tenantId }).populate('category', 'name slug');
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
  return product;
};

const createProduct = async (data) => {
  const product = await Product.create(data);
  return product;
};

const updateProduct = async (productId, tenantId, updates) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId, tenantId },
    updates,
    { new: true, runValidators: true }
  );
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
  return product;
};

const softDeleteProduct = async (productId, tenantId) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId, tenantId },
    { isActive: false },
    { new: true }
  );
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
  return product;
};

const decrementStock = async (tenantId, items, session) => {
  // Atomic stock decrement using $inc
  const ops = items.map(({ productId, variantSku, qty }) => ({
    updateOne: {
      filter: { _id: productId, tenantId, 'variants.sku': variantSku, 'variants.stock': { $gte: qty } },
      update: { $inc: { 'variants.$.stock': -qty } },
    },
  }));
  const result = await Product.bulkWrite(ops, { session });
  if (result.modifiedCount !== items.length) {
    throw Object.assign(new Error('One or more items are out of stock'), { status: 409 });
  }
};

const refreshProductRatings = async (productId, tenantId) => {
  const result = await Review.aggregate([
    { $match: { productId: new (require('mongoose').Types.ObjectId)(productId), tenantId: new (require('mongoose').Types.ObjectId)(tenantId) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = result[0] || {};
  await Product.findByIdAndUpdate(productId, { 'ratings.avg': Math.round(avg * 10) / 10, 'ratings.count': count });
};

module.exports = { listProducts, getProduct, createProduct, updateProduct, softDeleteProduct, decrementStock, refreshProductRatings };
