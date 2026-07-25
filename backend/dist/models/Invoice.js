"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    pdfUrl: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Invoice', invoiceSchema);
