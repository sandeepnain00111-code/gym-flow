"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Joi validation middleware factory.
 * Usage:  router.post('/route', validate(schema), handler)
 *
 * Validates req.body against the provided Joi schema.
 * Returns a clean 400 response with specific field errors —
 * never leaks Mongoose internals to the client.
 */
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false, // collect all errors, not just the first
        stripUnknown: true // silently drop unknown fields (mass-assignment protection)
    });
    if (error) {
        const messages = error.details.map((d) => d.message.replace(/"/g, "'")).join(', ');
        return res.status(400).json({ success: false, message: messages });
    }
    next();
};
module.exports = validate;
