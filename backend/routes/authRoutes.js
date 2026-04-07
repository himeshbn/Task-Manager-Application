const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Register route with validation
router.post(
  '/register',
  authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isStrongPassword()
      .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol'),
  ],
  register
);

// Login route with validation
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Get current user (protected route)
router.get('/me', protect, getMe);

// Logout route to clear the HttpOnly Cookie securely
router.post('/logout', logout);

module.exports = router;