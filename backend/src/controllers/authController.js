const User = require('../models/User');
const Gym = require('../models/Gym');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { sendEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

// @desc    Register a new user (Gym Owner, Member, Trainer)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, gymId } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password,
      role: role || 'member',
      gymId: gymId || null,
      status: role === 'gym_owner' ? 'pending' : 'active'
    });

    await user.save();

    // If owner, we do not log them in automatically because their account is pending
    if (user.role === 'gym_owner') {
      return res.status(201).json({
        success: true,
        message: 'Owner registration successful. Your account is pending Super Admin approval.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    }

    // Otherwise, generate tokens and log in
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        gymId: user.gymId
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    if (user.status === 'pending') {
      res.status(403);
      throw new Error('Your account is pending approval by the admin.');
    }

    if (user.status === 'blocked') {
      res.status(403);
      throw new Error('Your account has been blocked.');
    }

    if (user.status === 'rejected') {
      res.status(403);
      throw new Error('Your account registration request was rejected.');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        gymId: user.gymId
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400);
      throw new Error('Refresh token is required');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'gymflow_refresh_secret_key_987654321!');

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    if (user.status !== 'active') {
      res.status(403);
      throw new Error('User status is not active');
    }

    const accessToken = generateAccessToken(user);
    res.json({
      success: true,
      accessToken
    });
  } catch (error) {
    res.status(401);
    next(new Error('Token refresh failed'));
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password request
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found with this email');
    }

    // SECURITY: Generate a secure reset token (expires in 30 minutes)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_RESET_SECRET || 'gymflow_reset_secret_key_reset123!',
      { expiresIn: '30m' }
    );

    // Build reset URL (replace with your actual frontend URL in production)
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send password reset email
    await sendEmail({
      to: user.email,
      subject: '🔐 GymFlow — Reset Your Password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#047857">Password Reset Request</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your GymFlow password. Click the button below to set a new password. This link expires in <strong>30 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#047857;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">
            Reset Password
          </a>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
          <p style="color:#9ca3af;font-size:12px">GymFlow SaaS — One QR. Complete Gym Management.</p>
        </div>
      `,
      text: `Reset your GymFlow password: ${resetUrl}\n\nThis link expires in 30 minutes.`
    });

    res.json({
      success: true,
      message: 'Password reset link generated. Check your email (or use returned token in development).',
      resetToken: process.env.NODE_ENV === 'production' ? undefined : resetToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password using token
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      res.status(400);
      throw new Error('Reset token and new password are required');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    // SECURITY: Verify reset token is valid and not expired
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_RESET_SECRET || 'gymflow_reset_secret_key_reset123!');
    } catch (err) {
      res.status(401);
      throw new Error('Invalid or expired reset token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update password (bcrypt hashing happens in User.save() pre-hook)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile-update
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(400);
        throw new Error('Invalid current password');
      }
      user.password = newPassword;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        gymId: user.gymId
      }
    });
  } catch (error) {
    next(error);
  }
};
