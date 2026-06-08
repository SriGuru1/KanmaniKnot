const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, tenantName, plan } = req.body;
    const { user, tenant } = await authService.register({ name, email, password, tenantName, plan });
    res.status(201).json({ message: 'Registered successfully', user: { id: user._id, name: user.name, email: user.email }, tenant });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, tenantId } = req.body;
    const { accessToken, refreshToken, user } = await authService.login({ email, password, tenantId });
    res.cookie('refreshToken', refreshToken, authService.REFRESH_COOKIE_OPTIONS);
    res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { accessToken } = await authService.refreshAccessToken(refreshToken);
    res.json({ accessToken });
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.userId);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: 'If that email exists, an OTP has been sent.' });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    res.json({ message: 'Password reset successfully' });
  } catch (err) { next(err); }
};
