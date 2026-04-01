const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get('/', protect, authorize('admin', 'user', 'client'), getTasks);
router.get('/:id', protect, authorize('admin', 'user', 'client'), getTaskById);
router.post('/', protect, authorize('admin', 'user'), createTask);
router.put('/:id', protect, authorize('admin', 'user'), updateTask);
router.delete('/:id', protect, authorize('admin', 'user'), deleteTask);

module.exports = router;