const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
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
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GymPlan',
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'expired', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial'],
      default: 'pending'
    },
    amount: {
      type: Number,
      required: true
    },
    pendingAmount: {
      type: Number,
      default: 0
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes — gymId + status queried for pending/active membership counts; memberId for per-member lookups
membershipSchema.index({ gymId: 1 });
membershipSchema.index({ memberId: 1 });
membershipSchema.index({ gymId: 1, status: 1 });
membershipSchema.index({ memberId: 1, gymId: 1 });

module.exports = mongoose.model('Membership', membershipSchema);
