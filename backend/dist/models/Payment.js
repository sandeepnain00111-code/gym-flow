"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
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
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    membershipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Membership',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        enum: ['cash', 'upi', 'online'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'success', 'failed'],
        default: 'pending'
    },
    screenshot: {
        type: String,
        default: ''
    },
    transactionId: {
        type: String,
        default: ''
    },
    dueDate: {
        type: Date,
        default: null
    },
    paidAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
// Indexes — gymId for revenue totals; memberId for per-member payment history
paymentSchema.index({ gymId: 1 });
paymentSchema.index({ memberId: 1 });
paymentSchema.index({ gymId: 1, status: 1 });
module.exports = mongoose.model('Payment', paymentSchema);
