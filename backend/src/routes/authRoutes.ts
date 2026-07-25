const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refresh,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema
} = require('../validators/authValidators');

router.post('/register',        validate(registerSchema),        register);
router.post('/login',           validate(loginSchema),           login);
router.post('/refresh',                                          refresh);
router.post('/forgot-password', validate(forgotPasswordSchema),  forgotPassword);
router.post('/reset-password',  validate(resetPasswordSchema),   resetPassword);

// Protected routes
router.get('/me',              protect,                          getMe);
router.post('/logout',         protect,                          logout);
router.put('/profile-update',  protect, validate(updateProfileSchema), updateProfile);

module.exports = router;
