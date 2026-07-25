"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('joi');
// POST /api/member/join/:gymSlug
const joinGymSchema = Joi.object({
    planId: Joi.string().hex().length(24).required(),
    paymentMode: Joi.string().valid('cash', 'upi', 'online').required(),
    amount: Joi.number().min(0).optional(),
    transactionId: Joi.string().allow('').optional(),
    screenshot: Joi.string().allow('').optional() // URL after Cloudinary upload
});
// POST /api/member/payments/manual
const submitManualPaymentSchema = Joi.object({
    membershipId: Joi.string().hex().length(24).required(),
    amount: Joi.number().min(1).required(),
    mode: Joi.string().valid('cash', 'upi', 'online').required(),
    transactionId: Joi.string().allow('').optional(),
    screenshot: Joi.string().allow('').optional() // URL after Cloudinary upload
});
// POST /api/member/attendance/scan
const scanQRSchema = Joi.object({
    qrData: Joi.string().trim().required()
});
// POST /api/member/progress
const createProgressLogSchema = Joi.object({
    weight: Joi.number().min(1).max(500).required(),
    chest: Joi.number().min(0).optional(),
    waist: Joi.number().min(0).optional(),
    arms: Joi.number().min(0).optional(),
    beforePhoto: Joi.string().allow('').optional(),
    afterPhoto: Joi.string().allow('').optional(),
    notes: Joi.string().max(500).allow('').optional()
});
module.exports = {
    joinGymSchema,
    submitManualPaymentSchema,
    scanQRSchema,
    createProgressLogSchema
};
