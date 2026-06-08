const Tenant = require('../models/Tenant');

exports.getProfile = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    res.json({ tenant });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, settings, logoUrl } = req.body;
    const tenant = await Tenant.findByIdAndUpdate(
      req.user.tenantId,
      { name, settings, logoUrl },
      { new: true, runValidators: true }
    );
    res.json({ tenant });
  } catch (err) { next(err); }
};
