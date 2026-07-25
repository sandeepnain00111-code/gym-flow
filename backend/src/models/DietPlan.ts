const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema(
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      default: 'Standard Diet Plan'
    },
    meals: [
      {
        mealName: { type: String, required: true }, // Breakfast, Lunch, Dinner, Snacks, etc.
        foodItems: { type: String, required: true },
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 }, // in grams
        notes: { type: String, default: '' }
      }
    ],
    totalCalories: {
      type: Number,
      default: 0
    },
    totalProtein: {
      type: Number,
      default: 0 // in grams
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DietPlan', dietPlanSchema);
