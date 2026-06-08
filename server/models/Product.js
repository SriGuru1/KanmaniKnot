const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  sku:         { type: String, required: true },
  tasselType:  { type: String, trim: true },
  colour:      { type: String, trim: true },
  weavePattern:{ type: String, trim: true },
  zariWeight:  { type: String, trim: true },
  length:      { type: Number }, // metres
  price:       { type: Number, required: true, min: 0 },
  stock:       { type: Number, required: true, default: 0, min: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  tenantId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  basePrice:   { type: Number, required: true, min: 0 },
  images:      [{ type: String }],
  variants:    [variantSchema],
  ratings:     {
    avg:   { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  isActive:    { type: Boolean, default: true },
  tags:        [{ type: String, trim: true }],
}, { timestamps: true });

// Indexes
productSchema.index({ tenantId: 1, category: 1, isActive: 1 });
productSchema.index({ tenantId: 1, isActive: 1, createdAt: -1 });
productSchema.index({ 'variants.sku': 1 }, { unique: true, sparse: true });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Enforce tenantId on all queries via pre-hook
productSchema.pre(/^find/, function (next) {
  if (!this.getQuery().tenantId) {
    console.warn('[Product] Query missing tenantId filter — potential cross-tenant leak');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
