const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    subject: { type: String, required: [true, 'Subject is required'], trim: true, maxlength: 120 },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message must be 2000 characters or fewer'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
