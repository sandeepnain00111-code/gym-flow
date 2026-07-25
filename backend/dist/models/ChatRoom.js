"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const chatRoomSchema = new mongoose.Schema({
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    },
    name: {
        type: String,
        required: true,
        default: 'General Discussion'
    },
    type: {
        type: String,
        enum: ['group', 'direct'],
        default: 'group'
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
});
module.exports = mongoose.model('ChatRoom', chatRoomSchema);
