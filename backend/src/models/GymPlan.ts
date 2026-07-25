const mongoose = require('mongoose');

const gymPlanSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    durationInDays: {
      type: Number,
      required: [true, 'Plan duration in days is required']
    },
    price: {
      type: Number,
      required: [true, 'Plan price is required']
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

module.exports = mongoose.model('GymPlan', gymPlanSchema);
