const express = require('express');
const router = express.Router();

const { generateProjectsPDF } = require('../controllers/reportController');

const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get(
  '/projects/pdf',
  protect,
  authorize('admin', 'user', 'client'),
  generateProjectsPDF
);

module.exports = router;