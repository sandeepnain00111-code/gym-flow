"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('joi');
// POST /api/public/gym/:slug/demo-booking
const createDemoBookingSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().lowercase().required(),
    phone: Joi.string().trim().min(7).max(15).required(),
    date: Joi.date().iso().min('now').required(),
    timeSlot: Joi.string().trim().optional(),
    notes: Joi.string().trim().max(500).allow('').optional()
});
module.exports = { createDemoBookingSchema };
