const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const { sendEmail } = require('../utils/emailService');

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days ms
};

const register = async ({ name, email, password, tenantName, plan }) => {
  // Check if email already exists globally (platform_admin) or per subdomain
  const subdomain = tenantName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const existingTenant = await Tenant.findOne({ subdomain });
  if (existingTenant) throw Object.assign(new Error('Subdomain already taken'), { status: 409 });

  // Create tenant first
  const tenant = await Tenant.create({ name: tenantName, subdomain, ownerId: null, plan: plan || 'trial' });

  // Create owner user
  const user = await User.create({
    tenantId: tenant._id,
    email,
    passwordHash: password,
    name,
    role: 'tenant_admin',
  });

  // Link owner
  tenant.ownerId = user._id;
  await tenant.save();

  // Send welcome email (non-blocking)
  sendEmail({
    to: email,
    subject: 'Welcome to Saree Tassels!',
    template: 'welcome',
    data: { name, tenantName },
  }).catch(console.error);

  return { user, tenant };
};

const login = async ({ email, password, tenantId }) => {
  const query = tenantId ? { email, tenantId } : { email, role: 'platform_admin' };
  const user = await User.findOne(query).select('+passwordHash');
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const valid = await user.comparePassword(password);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  if (!user.isActive) throw Object.assign(new Error('Account inactive'), { status: 403 });

  const tokenPayload = { userId: user._id, tenantId: user.tenantId, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken, user };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw Object.assign(new Error('No refresh token'), { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 });
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.refreshToken !== refreshToken) {
    throw Object.assign(new Error('Refresh token mismatch'), { status: 401 });
  }

  const tokenPayload = { userId: user._id, tenantId: user.tenantId, role: user.role };
  const newAccessToken = generateAccessToken(tokenPayload);
  return { accessToken: newAccessToken };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return; // don't reveal user existence

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOTP = otp;
  user.resetOTPExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: email,
    subject: 'Password Reset OTP',
    template: 'resetPassword',
    data: { name: user.name, otp },
  });
};

const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email }).select('+resetOTP +resetOTPExpiry');
  if (!user || user.resetOTP !== otp || user.resetOTPExpiry < new Date()) {
    throw Object.assign(new Error('Invalid or expired OTP'), { status: 400 });
  }
  user.passwordHash = newPassword;
  user.resetOTP = undefined;
  user.resetOTPExpiry = undefined;
  await user.save();
};

module.exports = {
  register, login, refreshAccessToken, logout, forgotPassword, resetPassword,
  REFRESH_COOKIE_OPTIONS,
};
