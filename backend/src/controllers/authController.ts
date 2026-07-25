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

    // Validate and clean Indian Phone Number
    if (!phone) {
      res.status(400);
      throw new Error('Phone number is required');
    }

    let cleanPhone = String(phone).replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.startsWith('+91')) cleanPhone = cleanPhone.substring(3);
    else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.substring(2);
    else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = cleanPhone.substring(1);

    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleanPhone)) {
      res.status(400);
      throw new Error('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
    }

    const cleanEmail = email ? String(email).toLowerCase().trim() : '';

    // Check if user already exists by email
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Check if user already exists by phone
    const phoneExists = await User.findOne({ phone: cleanPhone });
    if (phoneExists) {
      res.status(400);
      throw new Error('This mobile number is already registered with another account.');
    }

    // Create user directly in database
    const user = new User({
      name,
      email: cleanEmail,
      phone: cleanPhone,
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
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: cleanEmail });

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
      subject: '🔐 Reset Your GymFlow Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 36px 28px; text-align: center; }
            .header-badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #10b981; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 14px; border-radius: 50px; margin-bottom: 12px; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
            .body { padding: 32px 28px; text-align: left; }
            .greeting { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
            .text { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 28px; }
            .cta-wrapper { text-align: center; margin: 32px 0; }
            .cta-btn { display: inline-block; background: linear-gradient(135deg, #047857, #10b981); color: #ffffff !important; font-weight: 800; font-size: 15px; padding: 16px 36px; border-radius: 14px; text-decoration: none; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35); }
            .warning { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 16px; font-size: 13px; color: #b45309; line-height: 1.5; margin-top: 24px; }
            .footer { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 28px; text-align: center; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="header-badge">Account Security</div>
              <h1>Password Reset Request</h1>
            </div>
            <div class="body">
              <div class="greeting">Hi ${user.name},</div>
              <div class="text">
                We received a request to reset your password for your GymFlow account. Click the button below to secure your account and set a new password. This link is valid for <strong>30 minutes</strong>.
              </div>

              <div class="cta-wrapper">
                <a href="${resetUrl}" target="_blank" class="cta-btn">Set New Password</a>
              </div>

              <div style="background:#f1f5f9;padding:14px;border-radius:10px;font-size:12px;color:#475569;word-break:break-all;margin-top:16px;">
                <strong>Direct Link:</strong><br/>
                <a href="${resetUrl}" target="_blank" style="color:#059669;font-weight:bold;text-decoration:underline;">${resetUrl}</a>
              </div>

              <div class="warning">
                🔒 <strong>Security Notice:</strong> If you did not request a password reset, please ignore this email. Your password will remain unchanged.
              </div>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} GymFlow SaaS • One QR. Complete Gym Management.
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hi ${user.name},\n\nReset your GymFlow password: ${resetUrl}\n\nThis link expires in 30 minutes.`
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
