const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Gym name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    logo: {
      type: String,
      default: ''
    },
    coverImage: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Gym phone is required']
    },
    email: {
      type: String,
      required: [true, 'Gym email is required'],
      trim: true,
      lowercase: true
    },
    openingTime: {
      type: String,
      default: '06:00 AM'
    },
    closingTime: {
      type: String,
      default: '10:00 PM'
    },
    facilities: [
      {
        type: String
      }
    ],
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' }
    },
    qrCodeUrl: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Gym', gymSchema);
