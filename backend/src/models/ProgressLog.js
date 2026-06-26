const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    weight: {
      type: Number, // in kg
      required: true
    },
    chest: {
      type: Number, // in inches
      default: 0
    },
    waist: {
      type: Number, // in inches
      default: 0
    },
    arms: {
      type: Number, // in inches
      default: 0
    },
    beforePhoto: {
      type: String,
      default: ''
    },
    afterPhoto: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ProgressLog', progressLogSchema);
