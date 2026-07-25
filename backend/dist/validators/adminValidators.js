"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('joi');
// POST /api/admin/subscription-plans
const createSubscriptionPlanSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    price: Joi.number().min(0).required(),
    durationInDays: Joi.number().integer().min(1).required(),
    maxMembers: Joi.number().integer().min(1).required(),
    maxTrainers: Joi.number().integer().min(0).required(),
    description: Joi.string().trim().max(500).allow('').optional(),
    isActive: Joi.boolean().optional()
});
// PUT /api/admin/subscription-plans/:id
const updateSubscriptionPlanSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    price: Joi.number().min(0).optional(),
    durationInDays: Joi.number().integer().min(1).optional(),
    maxMembers: Joi.number().integer().min(1).optional(),
    maxTrainers: Joi.number().integer().min(0).optional(),
    description: Joi.string().trim().max(500).allow('').optional(),
    isActive: Joi.boolean().optional()
});
module.exports = {
    createSubscriptionPlanSchema,
    updateSubscriptionPlanSchema
};
