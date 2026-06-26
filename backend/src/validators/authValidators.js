const Joi = require('joi');

// POST /api/auth/register
const registerSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(100).required(),
  email:    Joi.string().trim().email().lowercase().required(),
  phone:    Joi.string().trim().min(7).max(15).required(),
  password: Joi.string().min(6).max(128).required(),
  role:     Joi.string().valid('member', 'gym_owner', 'trainer').default('member'),
  gymId:    Joi.string().hex().length(24).allow(null, '').optional() // ObjectId
});

// POST /api/auth/login
const loginSchema = Joi.object({
  email:    Joi.string().trim().email().lowercase().required(),
  password: Joi.string().required()
});

// POST /api/auth/forgot-password
const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required()
});

// POST /api/auth/reset-password
const resetPasswordSchema = Joi.object({
  resetToken:  Joi.string().required(),
  newPassword: Joi.string().min(6).max(128).required()
});

// PUT /api/auth/profile-update
const updateProfileSchema = Joi.object({
  name:            Joi.string().trim().min(2).max(100).optional(),
  phone:           Joi.string().trim().min(7).max(15).optional(),
  currentPassword: Joi.string().optional(),
  newPassword:     Joi.string().min(6).max(128).optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema
};
