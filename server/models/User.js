const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['platform_admin', 'tenant_admin', 'customer'];

const userSchema = new mongoose.Schema({
  tenantId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }, // null for platform_admin
  email:        { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  name:         { type: String, required: true, trim: true },
  phone:        { type: String, trim: true },
  role:         { type: String, enum: ROLES, default: 'customer' },
  refreshToken: { type: String, select: false },
  resetOTP:     { type: String, select: false },
  resetOTPExpiry: { type: Date, select: false },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

// Compound unique index: one email per tenant
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
