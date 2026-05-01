const express = require('express');
const router = express.Router();

const { getHistories } = require('../controllers/historyController');

const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get(
  '/',
  protect,
  authorize('admin', 'user', 'client'),
  getHistories
);

module.exports = router;