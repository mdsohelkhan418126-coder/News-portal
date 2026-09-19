const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// PUT /api/users/profile  -> update name, email, phone, bio, avatar
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.email && req.body.email.toLowerCase().trim() !== user.email) {
    const taken = await User.findOne({ email: req.body.email.toLowerCase().trim() });
    if (taken) throw new ApiError(409, 'That email is already in use');
  }

  ['name', 'email', 'phone', 'bio', 'avatar'].forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  await user.save();
  res.json({ success: true, user });
});

// PUT /api/users/password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current and new password are required');
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});
