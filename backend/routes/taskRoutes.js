const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All task routes are protected
router.use(protect);

const taskValidation = [
  body('title').notEmpty().withMessage('Task title is required').trim().escape(),
  body('description').optional().trim().escape(),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
];

// Routes for /api/tasks
router.route('/').get(getTasks).post(taskValidation, createTask);

// Routes for /api/tasks/:id
router.route('/:id').get(getTask).put(taskValidation, updateTask).delete(deleteTask);

module.exports = router;