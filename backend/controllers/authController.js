import User from '../models/User.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendResetEmail } from '../utils/emailService.js';

export const registerUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      user
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    console.log('=== RESET PASSWORD REQUEST ===');
    console.log('Token:', req.params.resetToken);
    
    if (!req.params.resetToken) {
      console.error('No reset token provided');
      return res.status(400).json({
        success: false,
        message: 'Reset token is required'
      });
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    console.log('Hashed token:', resetPasswordToken);
    console.log('Current time:', new Date().toISOString());
    
    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      console.log('No user found with token or token expired');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token. Please request a new password reset.'
      });
    }

    console.log('User found for token:', user.email);
    
    // Validate password
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Set new password - let the pre-save middleware handle hashing
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    try {
      await user.save();
      console.log('Password updated successfully for user:', user.email);

      return res.status(200).json({
        success: true,
        message: 'Password reset successful. You can now log in with your new password.'
      });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      throw new Error('Failed to save new password');
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  console.log('=== FORGOT PASSWORD REQUEST ===');
  console.log('Request body:', req.body);
  
  try {
    const { email } = req.body;
    
    if (!email) {
      console.error('❌ No email provided in request');
      return res.status(400).json({
        success: false,
        message: 'Email is required',
        error: 'Email is required'
      });
    }

    // Check if user exists
    console.log('🔍 Looking for user with email:', email);
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log('ℹ️ No user found with email:', email);
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent'
      });
    }

    console.log('✅ User found, generating reset token...');
    
    // Generate reset token
    try {
      console.log('🔑 Generating reset token...');
      const resetToken = user.getResetPasswordToken();
      console.log('💾 Saving user with reset token...');
      await user.save({ validateBeforeSave: false });
      console.log('✅ User saved with reset token');

      try {
        console.log('📧 Sending reset email to:', user.email);
        console.log('Using FRONTEND_URL:', process.env.FRONTEND_URL);
        console.log('Using GMAIL_USER:', process.env.GMAIL_USER ? 'Set' : 'Not set');
        
        await sendResetEmail(user.email, resetToken);
        console.log('✅ Reset email sent successfully');

        return res.status(200).json({
          success: true,
          message: 'If an account with that email exists, a reset link has been sent'
        });
      } catch (emailError) {
        console.error('❌ Email send error:', emailError);
        console.error('Error stack:', emailError.stack);
        
        // Clean up the reset token since sending failed
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json({
          success: false,
          message: 'Email could not be sent',
          error: emailError.message,
          details: emailError.stack
        });
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      return res.status(500).json({
        success: false,
        message: 'Error processing password reset request',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
      error: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};
