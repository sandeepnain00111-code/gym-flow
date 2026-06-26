const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Plan price is required']
    },
    durationInDays: {
      type: Number,
      required: [true, 'Plan duration is required'],
      default: 30
    },
    maxMembers: {
      type: Number,
      required: true,
      default: 100 // limit members
    },
    maxTrainers: {
      type: Number,
      required: true,
      default: 5 // limit trainers
    },
    description: {
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

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
