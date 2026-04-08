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

const createTaskValidation = [
  body('title').notEmpty().withMessage('Task title is required').trim().escape(),
  body('description').optional().trim().escape(),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
];

const updateTaskValidation = [
  body('title').optional().notEmpty().withMessage('Task title cannot be empty').trim().escape(),
  body('description').optional().trim().escape(),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
];

// Routes for /api/tasks
router.route('/').get(getTasks).post(createTaskValidation, createTask);

// Routes for /api/tasks/:id
router.route('/:id').get(getTask).put(updateTaskValidation, updateTask).delete(deleteTask);

module.exports = router;