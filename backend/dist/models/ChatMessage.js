"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const chatMessageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    media: {
        type: String,
        default: ''
    },
    readBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
});
// Index — roomId queried on every message history fetch (most frequent chat query)
chatMessageSchema.index({ roomId: 1, createdAt: 1 });
module.exports = mongoose.model('ChatMessage', chatMessageSchema);
