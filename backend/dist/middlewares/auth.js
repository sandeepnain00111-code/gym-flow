"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req, res, next) => {
    let token;
    // Check for token in Authorization header (Bearer token) or in cookies
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
    try {
        // DEV BYPASS TOKEN SUPPORT
        if (typeof token === 'string' && token.startsWith('dev-bypass-token')) {
            let email = 'admin@gymflow.com';
            if (token === 'dev-bypass-token-owner' || token === 'dev-bypass-token') {
                email = 'owner@gymflow.com';
            }
            else if (token === 'dev-bypass-token-member') {
                email = 'member@gymflow.com';
            }
            else if (token === 'dev-bypass-token-admin') {
                email = 'admin@gymflow.com';
            }
            const user = await User.findOne({ email }).select('-password');
            if (user) {
                req.user = user;
                return next();
            }
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'gymflow_access_secret_key_123456789!');
        // Get user from database
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        if (req.user.status === 'blocked') {
            return res.status(403).json({ success: false, message: 'Your account is blocked' });
        }
        if (req.user.status === 'rejected') {
            return res.status(403).json({ success: false, message: 'Your account has been rejected' });
        }
        next();
    }
    catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this resource`
            });
        }
        next();
    };
};
module.exports = { protect, authorize };
