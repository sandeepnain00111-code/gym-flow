"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const workoutPlanSchema = new mongoose.Schema({
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
        default: 'General Fitness Plan'
    },
    days: [
        {
            day: {
                type: String,
                required: true
            },
            exercises: [
                {
                    exercise: { type: String, required: true },
                    sets: { type: Number, default: 3 },
                    reps: { type: String, default: '10-12' },
                    rest: { type: String, default: '60s' },
                    notes: { type: String, default: '' },
                    videoUrl: { type: String, default: '' }
                }
            ]
        }
    ]
}, {
    timestamps: true
});
module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
