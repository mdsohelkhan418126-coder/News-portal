const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Requires a valid "Authorization: Bearer <token>" header.
exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) throw new ApiError(401, 'Please log in to continue');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'This account no longer exists');

  req.user = user;
  next();
});
