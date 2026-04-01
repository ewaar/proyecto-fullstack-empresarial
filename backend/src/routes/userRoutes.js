const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUserByAdmin,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get('/', protect, authorize('admin'), getUsers);
router.post('/', protect, authorize('admin'), createUserByAdmin);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;