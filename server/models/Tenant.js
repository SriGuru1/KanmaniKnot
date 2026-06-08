const mongoose = require('mongoose');

const PLANS = ['basic', 'pro', 'enterprise'];
const STATUS = ['trial', 'active', 'suspended', 'cancelled'];

const planFeaturesMap = {
  basic:      { maxProducts: 100,  maxStaff: 2,  analyticsAccess: false },
  pro:        { maxProducts: 1000, maxStaff: 10, analyticsAccess: true  },
  enterprise: { maxProducts: Infinity, maxStaff: Infinity, analyticsAccess: true },
};

const tenantSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  subdomain:  { type: String, required: true, unique: true, lowercase: true, trim: true },
  ownerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan:       { type: String, enum: PLANS, default: 'trial' },
  status:     { type: String, enum: STATUS, default: 'trial' },
  logoUrl:    { type: String },
  settings:   { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

// Virtual: planFeatures
tenantSchema.virtual('planFeatures').get(function () {
  return planFeaturesMap[this.plan] || planFeaturesMap.basic;
});

tenantSchema.index({ status: 1 });
tenantSchema.index({ plan: 1 });

module.exports = mongoose.model('Tenant', tenantSchema);
