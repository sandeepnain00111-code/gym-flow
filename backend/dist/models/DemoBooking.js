"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const demoBookingSchema = new mongoose.Schema({
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Preferred date is required']
    },
    timeSlot: {
        type: String,
        default: 'Evening (05:00 PM - 08:00 PM)'
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'converted', 'rejected'],
        default: 'pending'
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('DemoBooking', demoBookingSchema);
