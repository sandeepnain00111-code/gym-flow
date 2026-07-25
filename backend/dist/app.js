"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan'); // request logging
const errorHandler = require('./middlewares/error');
// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const memberRoutes = require('./routes/memberRoutes');
const publicRoutes = require('./routes/publicRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const app = express();
// Security middlewares
app.use(helmet());
// Request logging in development mode
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}
// CORS configuration - allowing local frontend development & production Vercel apps
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    process.env.CLIENT_URL
].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Rate Limiting for Auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many auth requests, please try again after 15 minutes'
});
app.use('/api/auth', authLimiter);
// API Base Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes); // file upload → Cloudinary
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ success: true, status: 'API operational', timestamp: new Date() });
});
// Global Error Handler Middleware
app.use(errorHandler);
module.exports = app;
