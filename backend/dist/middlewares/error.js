"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error console for development
    console.error('API Error:', err);
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new Error(message);
        res.status(404);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(', ')}`;
        error = new Error(message);
        res.status(400);
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors || {});
        const message = validationErrors.map((val) => val?.message || 'Validation error').join(', ');
        error = new Error(message);
        res.status(400);
    }
    res.status(res.statusCode === 200 ? 500 : res.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};
module.exports = errorHandler;
