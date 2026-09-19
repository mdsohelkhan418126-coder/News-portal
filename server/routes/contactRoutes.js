const router = require('express').Router();
const { sendMessage } = require('../controllers/contactController');

router.post('/', sendMessage);

module.exports = router;
