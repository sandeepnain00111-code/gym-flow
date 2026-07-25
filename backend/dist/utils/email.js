"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Nodemailer email utility.
 * Uses SMTP credentials from environment variables.
 * Call sendEmail() from any controller to send transactional emails.
 */
const nodemailer = require('nodemailer');
// Create reusable transporter — lazy singleton pattern
let transporter = null;
const getTransporter = () => {
    if (transporter)
        return transporter;
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_PORT === '465', // true for port 465 (TLS), false for 587 (STARTTLS)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    return transporter;
};
/**
 * Send a transactional email.
 * @param {Object} options
 * @param {string} options.to        - Recipient email
 * @param {string} options.subject   - Email subject
 * @param {string} options.html      - HTML body
 * @param {string} [options.text]    - Plain-text fallback body
 */
const sendEmail = async ({ to, subject, html, text }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️  Email credentials not configured — skipping email send');
        return; // Don't crash the app if email isn't set up yet
    }
    const info = await getTransporter().sendMail({
        from: `"GymFlow SaaS" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    });
    console.log(`📧  Email sent to ${to}: ${info.messageId}`);
    return info;
};
module.exports = { sendEmail };
