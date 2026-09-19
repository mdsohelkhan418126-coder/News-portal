const Contact = require('../models/Contact');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/contact
exports.sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) throw new ApiError(400, 'Please fill in every field');

  await Contact.create({ name, email, subject, message });
  res.status(201).json({ success: true, message: 'Thanks for writing to us. We will reply soon.' });
});
