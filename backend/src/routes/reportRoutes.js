const express = require('express');
const router = express.Router();

const {
  generateProjectsPDF,
  getGeneratedReports,
  downloadGeneratedReport
} = require('../controllers/reportController');

const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get(
  '/projects/pdf',
  protect,
  authorize('admin', 'user', 'client'),
  generateProjectsPDF
);

router.get(
  '/generated',
  protect,
  authorize('admin', 'user', 'client'),
  getGeneratedReports
);

router.get(
  '/generated/:id/download',
  protect,
  authorize('admin', 'user', 'client'),
  downloadGeneratedReport
);

module.exports = router;