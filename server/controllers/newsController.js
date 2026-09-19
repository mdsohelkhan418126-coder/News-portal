const mongoose = require('mongoose');
const News = require('../models/News');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const AUTHOR_FIELDS = 'name avatar bio';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pickNewsFields = (body) => {
  const fields = {};
  ['title', 'summary', 'content', 'category', 'imageUrl'].forEach((key) => {
    if (body[key] !== undefined) fields[key] = body[key];
  });
  if (body.tags !== undefined) {
    const list = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',');
    fields.tags = [...new Set(list.map((t) => String(t).trim().toLowerCase()).filter(Boolean))].slice(0, 6);
  }
  return fields;
};

const findOwnedNews = async (id, user) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, 'News not found');
  const news = await News.findById(id);
  if (!news) throw new ApiError(404, 'News not found');
  if (news.author.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You can only change your own stories');
  }
  return news;
};

// GET /api/news?page=1&limit=9&category=Sports&search=cup&sort=latest|popular|oldest
exports.getAllNews = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.author && mongoose.isValidObjectId(req.query.author)) filter.author = req.query.author;
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(req.query.search.trim()), 'i');
    filter.$or = [{ title: rx }, { summary: rx }, { tags: rx }];
  }

  const sortMap = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { views: -1, createdAt: -1 },
  };
  const sort = sortMap[req.query.sort] || sortMap.latest;

  const [total, news] = await Promise.all([
    News.countDocuments(filter),
    News.find(filter)
      .select('-content')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS),
  ]);

  res.json({ success: true, news, page, pages: Math.ceil(total / limit) || 1, total });
});

// GET /api/news/top?limit=6  -> most-read stories
exports.getTopNews = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 20);
  const filter = req.query.category ? { category: req.query.category } : {};

  const news = await News.find(filter)
    .select('-content')
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .populate('author', AUTHOR_FIELDS);

  res.json({ success: true, news });
});

// GET /api/news/categories -> every category with its story count
exports.getCategories = asyncHandler(async (req, res) => {
  const counts = await News.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map((c) => [c._id, c.count]));
  const categories = News.CATEGORIES.map((name) => ({ name, count: map[name] || 0 }));
  res.json({ success: true, categories });
});

// GET /api/news/mine (auth)
exports.getMyNews = asyncHandler(async (req, res) => {
  const news = await News.find({ author: req.user._id })
    .select('-content')
    .sort({ createdAt: -1 })
    .populate('author', AUTHOR_FIELDS);
  res.json({ success: true, news });
});

// GET /api/news/:id  (increments the view counter)
exports.getNewsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, 'News not found');

  // ?edit=1 is used by the editor so opening the form doesn't count as a read
  const update = req.query.edit ? {} : { $inc: { views: 1 } };
  const news = await News.findByIdAndUpdate(id, update, { new: true }).populate('author', AUTHOR_FIELDS);
  if (!news) throw new ApiError(404, 'News not found');

  const related = await News.find({ category: news.category, _id: { $ne: news._id } })
    .select('-content')
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('author', AUTHOR_FIELDS);

  res.json({ success: true, news, related });
});

// POST /api/news (auth)
exports.createNews = asyncHandler(async (req, res) => {
  const news = await News.create({ ...pickNewsFields(req.body), author: req.user._id });
  await news.populate('author', AUTHOR_FIELDS);
  res.status(201).json({ success: true, news });
});

// PUT /api/news/:id (auth, owner only)
exports.updateNews = asyncHandler(async (req, res) => {
  const news = await findOwnedNews(req.params.id, req.user);
  news.set(pickNewsFields(req.body));
  await news.save();
  await news.populate('author', AUTHOR_FIELDS);
  res.json({ success: true, news });
});

// DELETE /api/news/:id (auth, owner only)
exports.deleteNews = asyncHandler(async (req, res) => {
  const news = await findOwnedNews(req.params.id, req.user);
  await news.deleteOne();
  res.json({ success: true, message: 'Story deleted' });
});
