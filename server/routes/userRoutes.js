const router = require('express').Router();
const { updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;
