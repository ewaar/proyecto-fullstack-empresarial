const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.get('/', protect, authorize('admin', 'user', 'client'), getProjects);
router.get('/:id', protect, authorize('admin', 'user', 'client'), getProjectById);
router.post('/', protect, authorize('admin', 'user'), createProject);
router.put('/:id', protect, authorize('admin', 'user'), updateProject);
router.delete('/:id', protect, authorize('admin', 'user'), deleteProject);

module.exports = router;