const mongoose = require('mongoose');

const ORDER_STATUS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];

// Valid state machine transitions
const ALLOWED_TRANSITIONS = {
  PENDING:    ['CONFIRMED', 'CANCELLED'],
  CONFIRMED:  ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED'],
  SHIPPED:    ['DELIVERED'],
  DELIVERED:  ['RETURNED'],
  CANCELLED:  [],
  RETURNED:   [],
};

const orderItemSchema = new mongoose.Schema({
  productId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantSku: { type: String, required: true },
  qty:        { type: Number, required: true, min: 1 },
  price:      { type: Number, required: true },
  name:       { type: String },  // snapshot at order time
}, { _id: false });

const timelineSchema = new mongoose.Schema({
  status:    { type: String, enum: ORDER_STATUS },
  note:      { type: String },
  timestamp: { type: Date, default: Date.now },
  actorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  tenantId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  customerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:           [orderItemSchema],
  totalAmount:     { type: Number, required: true },
  status:          { type: String, enum: ORDER_STATUS, default: 'PENDING' },
  paymentInfo: {
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    status:            { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paidAt:            { type: Date },
  },
  shippingAddress: {
    line1:   { type: String },
    line2:   { type: String },
    city:    { type: String },
    state:   { type: String },
    pincode: { type: String },
    phone:   { type: String },
  },
  timeline: [timelineSchema],
  cancelReason: { type: String },
}, { timestamps: true });

orderSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
orderSchema.index({ tenantId: 1, customerId: 1 });

// State machine guard
orderSchema.methods.canTransitionTo = function (newStatus) {
  return ALLOWED_TRANSITIONS[this.status]?.includes(newStatus) ?? false;
};

orderSchema.statics.ALLOWED_TRANSITIONS = ALLOWED_TRANSITIONS;

module.exports = mongoose.model('Order', orderSchema);
