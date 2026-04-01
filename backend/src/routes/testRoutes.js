const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get('/private', protect, (req, res) => {
  res.json({
    message: 'Ruta privada accesible',
    user: req.user
  });
});

router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({
    message: 'Bienvenido administrador'
  });
});

module.exports = router;