const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      sparse: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['super_admin', 'gym_owner', 'trainer', 'member'],
      default: 'member'
    },
    avatar: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected', 'blocked'],
      default: function () {
        if (this.role === 'gym_owner') return 'pending';
        return 'active';
      }
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      default: null
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    refreshToken: {
      type: String,
      default: null
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes — gymId and role are queried together on almost every owner/member operation
userSchema.index({ gymId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ gymId: 1, role: 1 });

module.exports = mongoose.model('User', userSchema);
