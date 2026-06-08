const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  tenantId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, trim: true, maxlength: 1000 },
  isFlagged: { type: Boolean, default: false },
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
reviewSchema.index({ tenantId: 1, productId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
