const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name:     { type: String, required: true, trim: true },
  slug:     { type: String, required: true, lowercase: true, trim: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // self-ref
  imageUrl: { type: String },
}, { timestamps: true });

categorySchema.index({ tenantId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
