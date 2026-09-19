const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

const sendAuth = (res, statusCode, user) =>
  res.status(statusCode).json({ success: true, token: generateToken(user._id), user });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, 'Name, email and password are required');

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) throw new ApiError(409, 'An account with this email already exists');

  const user = await User.create({ name, email, password });
  sendAuth(res, 201, user);
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  sendAuth(res, 200, user);
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
