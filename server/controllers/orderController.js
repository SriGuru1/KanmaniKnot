const orderService = require('../services/orderService');

exports.placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder({ tenantId: req.user.tenantId, customerId: req.user.userId, ...req.body });
    res.status(201).json({ order });
  } catch (err) { next(err); }
};

exports.getTenantOrders = async (req, res, next) => {
  try {
    const result = await orderService.getOrdersByTenant({ tenantId: req.user.tenantId, ...req.query });
    res.json(result);
  } catch (err) { next(err); }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getCustomerOrders({ tenantId: req.user.tenantId, customerId: req.user.userId, ...req.query });
    res.json({ orders });
  } catch (err) { next(err); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const filter = { _id: req.params.id, tenantId: req.user.tenantId };
    if (req.user.role === 'customer') filter.customerId = req.user.userId;
    const order = await Order.findOne(filter);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus({
      orderId: req.params.id, tenantId: req.user.tenantId, actorId: req.user.userId, ...req.body,
    });
    res.json({ order });
  } catch (err) { next(err); }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder({
      orderId: req.params.id, tenantId: req.user.tenantId, customerId: req.user.userId, reason: req.body.reason,
    });
    res.json({ order });
  } catch (err) { next(err); }
};
