"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatRoom = require('../models/ChatRoom');
const ChatMessage = require('../models/ChatMessage');
const Gym = require('../models/Gym');
// FIX: User was missing — getParticipants() would crash with ReferenceError
const User = require('../models/User');
// @desc    Get or create gym room chat history
// @route   GET /api/chat/room/:gymId
// @access  Private (gym_owner, trainer, member)
exports.getRoomMessages = async (req, res, next) => {
    try {
        // SECURITY: Always use gymId from authenticated token, not from request params
        const gymId = req.user.gymId;
        if (!gymId) {
            res.status(403);
            throw new Error('You must be part of a gym to access chat');
        }
        // Find or create General room
        let room = await ChatRoom.findOne({ gymId, name: 'General Discussion' });
        if (!room) {
            room = await ChatRoom.create({
                gymId,
                name: 'General Discussion',
                type: 'group',
                members: [req.user._id]
            });
        }
        // Retrieve last 50 messages
        const messages = await ChatMessage.find({ roomId: room._id })
            .populate('senderId', 'name avatar role')
            .sort({ createdAt: 1 })
            .limit(50);
        res.json({
            success: true,
            roomId: room._id,
            roomName: room.name,
            messages
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get chat messages via query gymId
// @route   GET /api/chat/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
    try {
        // SECURITY: Always use gymId from authenticated token, not from request query
        const gymId = req.user.gymId;
        if (!gymId) {
            res.status(403);
            throw new Error('You must be part of a gym to access chat');
        }
        let room = await ChatRoom.findOne({ gymId, name: 'General Discussion' });
        if (!room) {
            room = await ChatRoom.create({
                gymId,
                name: 'General Discussion',
                type: 'group',
                members: [req.user._id]
            });
        }
        const messages = await ChatMessage.find({ roomId: room._id })
            .populate('senderId', 'name avatar role')
            .sort({ createdAt: 1 })
            .limit(100);
        res.json({
            success: true,
            messages
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Send/save chat message
// @route   POST /api/chat/message
// @access  Private
exports.postMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        // SECURITY: Always use gymId from authenticated token, not from request body
        const gymId = req.user.gymId;
        if (!gymId) {
            res.status(403);
            throw new Error('You must be part of a gym to send messages');
        }
        if (!message) {
            res.status(400);
            throw new Error('Message content is required');
        }
        let room = await ChatRoom.findOne({ gymId, name: 'General Discussion' });
        if (!room) {
            room = await ChatRoom.create({
                gymId,
                name: 'General Discussion',
                type: 'group',
                members: [req.user._id]
            });
        }
        const newMessage = await ChatMessage.create({
            roomId: room._id,
            senderId: req.user._id,
            message
        });
        const populated = await ChatMessage.findById(newMessage._id)
            .populate('senderId', 'name avatar role');
        res.status(201).json({
            success: true,
            message: populated
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get or create direct chat history between logged in user and target recipient
// @route   GET /api/chat/direct/:recipientId
// @access  Private
exports.getDirectMessages = async (req, res, next) => {
    try {
        const { recipientId } = req.params;
        // FIX: "sandbox_gym_id" fallback was a string — would fail Mongoose ObjectId validation
        const gymId = req.user.gymId;
        if (!gymId) {
            res.status(403);
            throw new Error('You must be part of a gym to use direct messages');
        }
        // Find direct room involving both users
        let room = await ChatRoom.findOne({
            gymId,
            type: 'direct',
            members: { $all: [req.user._id, recipientId] }
        });
        if (!room) {
            room = await ChatRoom.create({
                gymId,
                name: `Direct Chat`,
                type: 'direct',
                members: [req.user._id, recipientId]
            });
        }
        const messages = await ChatMessage.find({ roomId: room._id })
            .populate('senderId', 'name avatar role')
            .sort({ createdAt: 1 })
            .limit(100);
        res.json({
            success: true,
            roomId: room._id,
            messages
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Send / Save direct message
// @route   POST /api/chat/direct
// @access  Private
exports.postDirectMessage = async (req, res, next) => {
    try {
        const { recipientId, message } = req.body;
        // FIX: same invalid fallback removed — must belong to a gym
        const gymId = req.user.gymId;
        if (!gymId) {
            res.status(403);
            throw new Error('You must be part of a gym to send direct messages');
        }
        if (!recipientId || !message) {
            res.status(400);
            throw new Error('Recipient ID and message content are required');
        }
        let room = await ChatRoom.findOne({
            gymId,
            type: 'direct',
            members: { $all: [req.user._id, recipientId] }
        });
        if (!room) {
            room = await ChatRoom.create({
                gymId,
                name: `Direct Chat`,
                type: 'direct',
                members: [req.user._id, recipientId]
            });
        }
        const newMessage = await ChatMessage.create({
            roomId: room._id,
            senderId: req.user._id,
            message
        });
        const populated = await ChatMessage.findById(newMessage._id)
            .populate('senderId', 'name avatar role');
        res.status(201).json({
            success: true,
            roomId: room._id,
            message: populated
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all chat participants in the same gym
// @route   GET /api/chat/participants
// @access  Private
exports.getParticipants = async (req, res, next) => {
    try {
        const gymId = req.user.gymId;
        if (!gymId) {
            return res.json({ success: true, participants: [] });
        }
        const participants = await User.find({ gymId })
            .select('name role avatar status lastLogin')
            .sort({ name: 1 });
        // Exclude current logged in user
        const filtered = participants.filter(u => u._id.toString() !== req.user._id.toString());
        res.json({
            success: true,
            participants: filtered
        });
    }
    catch (error) {
        next(error);
    }
};
