const mongoose = require('mongoose');
const Order = require('../models/Order');
const { decrementStock } = require('./productService');
const { sendEmail } = require('../utils/emailService');

const placeOrder = async ({ tenantId, customerId, items, shippingAddress, paymentMethod }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Atomic stock decrement
    await decrementStock(tenantId, items, session);

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const [order] = await Order.create([{
      tenantId,
      customerId,
      items,
      totalAmount,
      shippingAddress,
      paymentInfo: { status: 'pending' },
      timeline: [{ status: 'PENDING', note: 'Order placed' }],
    }], { session });

    await session.commitTransaction();
    return order;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const updateOrderStatus = async ({ orderId, tenantId, newStatus, note, actorId }) => {
  const order = await Order.findOne({ _id: orderId, tenantId });
  if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });

  if (!order.canTransitionTo(newStatus)) {
    throw Object.assign(
      new Error(`Invalid transition: ${order.status} → ${newStatus}`),
      { status: 400 }
    );
  }

  order.status = newStatus;
  order.timeline.push({ status: newStatus, note, actorId });
  await order.save();

  // Non-blocking email notification
  sendEmail({
    to: order.customerId, // resolved to email in emailService
    subject: `Order Update: ${newStatus}`,
    template: 'orderUpdate',
    data: { orderId: order._id, status: newStatus, note },
  }).catch(console.error);

  return order;
};

const cancelOrder = async ({ orderId, tenantId, customerId, reason }) => {
  const order = await Order.findOne({ _id: orderId, tenantId, customerId });
  if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });
  if (!order.canTransitionTo('CANCELLED')) {
    throw Object.assign(new Error('Order cannot be cancelled at this stage'), { status: 400 });
  }
  order.status = 'CANCELLED';
  order.cancelReason = reason;
  order.timeline.push({ status: 'CANCELLED', note: reason, actorId: customerId });
  await order.save();
  return order;
};

const getOrdersByTenant = async ({ tenantId, status, page = 1, limit = 20 }) => {
  const filter = { tenantId };
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('customerId', 'name email'),
    Order.countDocuments(filter),
  ]);
  return { orders, total, page, pages: Math.ceil(total / limit) };
};

const getCustomerOrders = async ({ tenantId, customerId, status, page = 1, limit = 20 }) => {
  const filter = { tenantId, customerId };
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  return orders;
};

module.exports = { placeOrder, updateOrderStatus, cancelOrder, getOrdersByTenant, getCustomerOrders };
