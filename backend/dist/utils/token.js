"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, gymId: user.gymId }, process.env.JWT_ACCESS_SECRET || 'gymflow_access_secret_key_123456789!', { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || 'gymflow_refresh_secret_key_987654321!', { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' });
};
module.exports = { generateAccessToken, generateRefreshToken };
