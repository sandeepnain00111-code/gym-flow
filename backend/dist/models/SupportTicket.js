"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const supportTicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        default: null // null if it's a general platform ticket
    },
    title: {
        type: String,
        required: [true, 'Ticket title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: String,
        enum: ['Billing', 'Technical', 'General', 'Feedback'],
        default: 'General'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    status: {
        type: String,
        enum: ['Open', 'In-Progress', 'Resolved'],
        default: 'Open'
    },
    replies: [
        {
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            message: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});
module.exports = mongoose.model('SupportTicket', supportTicketSchema);
