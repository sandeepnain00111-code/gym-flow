const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
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
    date: {
      type: String, // format YYYY-MM-DD
      required: true
    },
    checkIn: {
      type: Date,
      required: true
    },
    checkOut: {
      type: Date,
      default: null
    },
    method: {
      type: String,
      enum: ['qr', 'manual'],
      default: 'qr'
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      default: 'present'
    }
  },
  {
    timestamps: true
  }
);

// Unique index to prevent duplicate attendance for the same member on the same date
attendanceSchema.index({ memberId: 1, date: 1 }, { unique: true });
// Index — gymId queried for today's attendance count on every owner dashboard load
attendanceSchema.index({ gymId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
