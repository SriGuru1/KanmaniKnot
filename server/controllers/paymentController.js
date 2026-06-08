const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: orderId,
    });
    await Order.findByIdAndUpdate(orderId, { 'paymentInfo.razorpayOrderId': rzpOrder.id });
    res.json({ razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) { next(err); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, signature, orderId } = req.body;

    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSig !== signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!order.canTransitionTo('CONFIRMED')) {
      return res.status(400).json({ error: 'Order already processed' });
    }

    order.paymentInfo.razorpayPaymentId = razorpayPaymentId;
    order.paymentInfo.status = 'paid';
    order.paymentInfo.paidAt = new Date();
    order.status = 'CONFIRMED';
    order.timeline.push({ status: 'CONFIRMED', note: 'Payment verified' });
    await order.save();

    res.json({ success: true, order });
  } catch (err) { next(err); }
};

exports.webhook = async (req, res, next) => {
  try {
    const sig = req.headers['x-razorpay-signature'];
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (sig !== expectedSig) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
      const receipt = payload.payment.entity.description; // orderId set as receipt
      const order = await Order.findById(receipt);
      if (order && order.status === 'PENDING') {
        order.paymentInfo.status = 'paid';
        order.paymentInfo.paidAt = new Date();
        order.status = 'CONFIRMED';
        order.timeline.push({ status: 'CONFIRMED', note: 'Payment captured via webhook' });
        await order.save();
      }
    }

    res.json({ received: true });
  } catch (err) { next(err); }
};
