const mongoose = require('mongoose');

const trainerProfileSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true
    },
    specialty: [
      {
        type: String
      }
    ],
    experience: {
      type: Number, // in years
      default: 0
    },
    bio: {
      type: String,
      default: ''
    },
    salary: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 5.0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TrainerProfile', trainerProfileSchema);
