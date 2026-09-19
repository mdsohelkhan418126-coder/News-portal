const router = require('express').Router();
const {
  getAllNews,
  getTopNews,
  getCategories,
  getMyNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');
const { protect } = require('../middleware/auth');

// Fixed paths must come before "/:id"
router.get('/top', getTopNews);
router.get('/categories', getCategories);
router.get('/mine', protect, getMyNews);

router.route('/').get(getAllNews).post(protect, createNews);
router.route('/:id').get(getNewsById).put(protect, updateNews).delete(protect, deleteNews);

module.exports = router;
