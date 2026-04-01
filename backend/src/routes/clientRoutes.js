const express = require('express');
const router = express.Router();
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get('/', protect, authorize('admin', 'user'), getClients);
router.get('/:id', protect, authorize('admin', 'user'), getClientById);
router.post('/', protect, authorize('admin', 'user'), createClient);
router.put('/:id', protect, authorize('admin', 'user'), updateClient);
router.delete('/:id', protect, authorize('admin', 'user'), deleteClient);

module.exports = router;