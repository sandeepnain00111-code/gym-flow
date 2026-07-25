"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { joinGymSchema, submitManualPaymentSchema, scanQRSchema, createProgressLogSchema } = require('../validators/memberValidators');
const { getDashboardStats, getMyGym, joinGym, scanQR, getPayments, submitManualPayment, getAttendanceHistory, getWorkoutPlan, getDietPlan, getProgressLogs, createProgressLog, deleteProgressLog, getAnnouncements } = require('../controllers/memberController');
// All routes require protection and member access
router.use(protect, authorize('member'));
router.get('/dashboard', getDashboardStats);
router.get('/my-gym', getMyGym);
router.post('/join/:gymSlug', validate(joinGymSchema), joinGym);
// QR Scanner Check-in
router.post('/attendance/scan', validate(scanQRSchema), scanQR);
router.get('/attendance', getAttendanceHistory);
// Payments & Renewals
router.get('/payments', getPayments);
router.post('/payments/manual', validate(submitManualPaymentSchema), submitManualPayment);
// Plans & routines
router.get('/workout-plan', getWorkoutPlan);
router.get('/diet-plan', getDietPlan);
// Progress Metric logs
router.route('/progress')
    .get(getProgressLogs)
    .post(validate(createProgressLogSchema), createProgressLog);
router.delete('/progress/:id', deleteProgressLog);
// Broadcasts
router.get('/announcements', getAnnouncements);
module.exports = router;
