const mongoose = require('mongoose');

const CATEGORIES = [
  'Politics',
  'Technology',
  'Sports',
  'Business',
  'Entertainment',
  'Health',
  'Science',
  'World',
  'Education',
  'Lifestyle',
];

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [150, 'Title must be 150 characters or fewer'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
      minlength: [10, 'Summary must be at least 10 characters'],
      maxlength: [300, 'Summary must be 300 characters or fewer'],
    },
    content: {
      type: String,
      required: [true, 'Story content is required'],
      trim: true,
      minlength: [50, 'Story must be at least 50 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: 'Choose a valid category' },
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/i.test(v),
        message: 'Cover image must be a valid http(s) URL',
      },
    },
    tags: { type: [String], default: [] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

newsSchema.index({ createdAt: -1 });
newsSchema.index({ views: -1, createdAt: -1 });
newsSchema.index({ category: 1, createdAt: -1 });

const News = mongoose.model('News', newsSchema);
News.CATEGORIES = CATEGORIES;

module.exports = News;
