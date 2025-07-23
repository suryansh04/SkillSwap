import express from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import { sendResetEmail } from '../utils/emailService.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  registerUser
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  loginUser
);

// @route   POST /api/auth/test-email
// @desc    Test email sending
// @access  Public
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required'
      });
    }
    
    console.log('Attempting to send test email to:', email);
    await sendResetEmail(email, 'test-reset-token');
    
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    // Check if user exists
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(200).json({ 
        success: true,
        message: 'If an account with that email exists, a reset link has been sent'
      });
    }
    
    console.log('User found, proceeding with password reset for:', email);
    
    // Send reset email
    forgotPassword(req, res);
  } catch (err) {
    console.error('Forgot password route error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server Error',
      error: err.message 
    });
  }
});

// @route   PUT /api/auth/reset-password/:resetToken
// @desc    Reset password
// @access  Public
router.put(
  '/reset-password/:resetToken',
  [
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  resetPassword
);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post(
  '/reset-password/:token',
  [
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  resetPassword
);

// @route   GET /api/auth/verify-reset-token/:token
// @desc    Verify reset token
// @access  Public
router.get(
  '/verify-reset-token/:token',
  resetPassword
);

export default router;
