"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require('../models/User');
const Gym = require('../models/Gym');
const GymPlan = require('../models/GymPlan');
const Membership = require('../models/Membership');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const DemoBooking = require('../models/DemoBooking');
const WorkoutPlan = require('../models/WorkoutPlan');
const DietPlan = require('../models/DietPlan');
const ProgressLog = require('../models/ProgressLog');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
// @desc    Get member dashboard details
// @route   GET /api/member/dashboard
// @access  Private (member)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const memberId = req.user._id;
        // Active Membership details
        const membershipDoc = await Membership.findOne({ memberId })
            .populate('gymId', 'name address slug logo')
            .populate('planId')
            .sort({ createdAt: -1 });
        let membership = null;
        if (membershipDoc) {
            membership = membershipDoc.toObject();
            // Calculate daysLeft
            let daysLeft = 0;
            if (membership.endDate) {
                const today = new Date();
                const end = new Date(membership.endDate);
                const diffTime = Number(end) - Number(today);
                daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (daysLeft < 0)
                    daysLeft = 0;
            }
            membership.daysLeft = daysLeft;
            // Calculate totalAttendanceLogs
            membership.totalAttendanceLogs = await Attendance.countDocuments({ memberId });
        }
        // Latest payments
        const payments = await Payment.find({ memberId }).sort({ createdAt: -1 });
        // Recent attendances
        const attendance = await Attendance.find({ memberId }).sort({ checkIn: -1 }).limit(10);
        const totalAttendanceThisMonth = await Attendance.countDocuments({
            memberId,
            checkIn: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        });
        // Workout and Diet plans
        const workoutPlan = await WorkoutPlan.findOne({ memberId }).sort({ createdAt: -1 });
        const dietPlan = await DietPlan.findOne({ memberId }).sort({ createdAt: -1 });
        // Find today's workout split based on the day of the week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayDayName = daysOfWeek[new Date().getDay()];
        let todayWorkout = null;
        if (workoutPlan && workoutPlan.days) {
            const dayWorkout = workoutPlan.days.find(d => d.day.toLowerCase() === todayDayName.toLowerCase());
            if (dayWorkout) {
                todayWorkout = {
                    dayName: dayWorkout.day,
                    title: workoutPlan.name,
                    exercises: dayWorkout.exercises.map(ex => ({
                        name: ex.exercise,
                        sets: ex.sets,
                        reps: ex.reps,
                        rest: ex.rest,
                        notes: ex.notes
                    }))
                };
            }
        }
        // Format today's diet plan
        let todayDiet = null;
        if (dietPlan && dietPlan.meals) {
            todayDiet = {
                meals: dietPlan.meals.map(m => ({
                    name: m.mealName,
                    time: m.notes || 'Scheduled',
                    items: m.foodItems,
                    calories: m.calories,
                    protein: m.protein
                }))
            };
        }
        // Body Progress logs (for BMI calculations and history)
        const progressLogs = await ProgressLog.find({ memberId }).sort({ createdAt: -1 });
        const latestProgress = progressLogs[0] || null;
        // Gym Announcements
        let announcements = [];
        if (req.user.gymId) {
            announcements = await Announcement.find({ gymId: req.user.gymId }).sort({ createdAt: -1 }).limit(5);
        }
        res.json({
            success: true,
            membership,
            payments,
            attendance,
            totalAttendanceThisMonth,
            workoutPlan,
            dietPlan,
            todayWorkout,
            todayDiet,
            latestProgress,
            progressLogs,
            announcements
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get details of member's gym
// @route   GET /api/member/my-gym
// @access  Private (member)
exports.getMyGym = async (req, res, next) => {
    try {
        if (!req.user.gymId) {
            return res.status(200).json({ success: true, gym: null, message: 'You have not joined any gym yet' });
        }
        const gym = await Gym.findById(req.user.gymId);
        res.json({ success: true, gym });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Join a gym using unique Slug (lands from QR code)
// @route   POST /api/member/join/:gymSlug
// @access  Private (member)
exports.joinGym = async (req, res, next) => {
    try {
        const { gymSlug } = req.params;
        const { planId, paymentMode, transactionId, screenshot, amount } = req.body;
        const gym = await Gym.findOne({ slug: gymSlug });
        if (!gym) {
            res.status(404);
            throw new Error('Gym not found');
        }
        const plan = await GymPlan.findById(planId);
        if (!plan) {
            res.status(404);
            throw new Error('Selected Gym Plan not found');
        }
        // Check if membership already active
        const activeMembership = await Membership.findOne({
            memberId: req.user._id,
            gymId: gym._id,
            status: { $in: ['active', 'pending'] }
        });
        if (activeMembership) {
            res.status(400);
            throw new Error('You already have an active or pending membership in this gym.');
        }
        const startDate = new Date();
        const endDate = new Date(Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000);
        // Create a pending membership
        const membership = await Membership.create({
            gymId: gym._id,
            memberId: req.user._id,
            planId: plan._id,
            startDate,
            endDate,
            status: 'pending',
            paymentStatus: 'pending',
            amount: plan.price,
            pendingAmount: 0
        });
        // Create a corresponding pending payment log
        await Payment.create({
            gymId: gym._id,
            memberId: req.user._id,
            ownerId: gym.ownerId,
            membershipId: membership._id,
            amount: amount || plan.price,
            mode: paymentMode || 'cash',
            status: 'pending',
            screenshot: screenshot || '',
            transactionId: transactionId || '',
            dueDate: endDate
        });
        // Link user to this gym
        await User.findByIdAndUpdate(req.user._id, { gymId: gym._id });
        // Create notification for gym owner
        await Notification.create({
            userId: gym.ownerId,
            title: 'New Membership Request',
            message: `${req.user.name} has requested access to join with the plan ${plan.name}.`,
            type: 'membership_request',
            isRead: false
        });
        res.status(201).json({
            success: true,
            message: 'Membership requested! Your gym owner will verify payment shortly.',
            membership
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Member checks-in or checks-out using QR scan
// @route   POST /api/member/attendance/scan
// @access  Private (member)
exports.scanQR = async (req, res, next) => {
    try {
        const { qrData } = req.body; // Expecting the gym's Slug or custom scan token
        if (!qrData) {
            res.status(400);
            throw new Error('No QR data found in scan');
        }
        let targetQrData = qrData;
        // Check if the qrData is a JSON string and parse it if so
        if (typeof qrData === 'string' && qrData.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(qrData);
                targetQrData = parsed.gymId || parsed.slug || qrData;
            }
            catch (e) {
                // Fall back to original qrData if parsing fails
            }
        }
        // Special fallback for mock-gym-101 to map it to the seeded gym 'iron-forge'
        if (targetQrData === 'mock-gym-101') {
            targetQrData = 'iron-forge';
        }
        console.log('Processed QR check-in scan:', { original: qrData, resolved: targetQrData });
        // Identify gym using either slug or code
        let gym;
        if (require('mongoose').Types.ObjectId.isValid(targetQrData)) {
            gym = await Gym.findById(targetQrData);
        }
        if (!gym) {
            gym = await Gym.findOne({ $or: [{ slug: targetQrData }, { qrCodeUrl: targetQrData }] });
        }
        if (!gym) {
            res.status(404);
            throw new Error('Invalid QR scan. Gym not registered.');
        }
        // Verify membership is active
        const membership = await Membership.findOne({
            memberId: req.user._id,
            gymId: gym._id,
            status: 'active'
        });
        if (!membership) {
            res.status(403);
            throw new Error('Access Denied. You do not have an active membership in this gym.');
        }
        const todayStr = new Date().toISOString().split('T')[0];
        let attendance = await Attendance.findOne({ memberId: req.user._id, date: todayStr });
        if (!attendance) {
            // Check-in
            attendance = await Attendance.create({
                gymId: gym._id,
                memberId: req.user._id,
                date: todayStr,
                checkIn: new Date(),
                method: 'qr',
                status: 'present'
            });
            return res.json({
                success: true,
                type: 'check-in',
                message: 'Checked-in successfully! Have a great workout! 💪',
                attendance
            });
        }
        else if (!attendance.checkOut) {
            // Check-out
            attendance.checkOut = new Date();
            await attendance.save();
            return res.json({
                success: true,
                type: 'check-out',
                message: 'Checked-out successfully! See you tomorrow! 🏋️',
                attendance
            });
        }
        else {
            return res.json({
                success: true,
                type: 'completed',
                message: 'You have already checked-in and checked-out for today.',
                attendance
            });
        }
    }
    catch (error) {
        next(error);
    }
};
// ================= PAYMENTS AND MANUEAL UPI SUBMISSION =================
exports.getPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({ memberId: req.user._id })
            .populate('gymId', 'name city slug logo')
            .sort({ createdAt: -1 });
        res.json({ success: true, payments });
    }
    catch (error) {
        next(error);
    }
};
exports.submitManualPayment = async (req, res, next) => {
    try {
        const { membershipId, amount, mode, transactionId, screenshot } = req.body;
        // FIX: was findById(membershipId) — any member could submit payment against any membership ID on the platform
        // Now scoped to req.user._id so members can only pay for their own memberships
        const membership = await Membership.findOne({ _id: membershipId, memberId: req.user._id }).populate('gymId');
        if (!membership) {
            res.status(404);
            throw new Error('Membership details not found');
        }
        const payment = await Payment.create({
            gymId: membership.gymId._id,
            memberId: req.user._id,
            ownerId: membership.gymId.ownerId,
            membershipId: membership._id,
            amount,
            mode, // 'upi' or 'cash'
            status: 'pending',
            screenshot: screenshot || '',
            transactionId: transactionId || '',
            dueDate: membership.endDate
        });
        res.status(201).json({
            success: true,
            message: 'Fee payment submitted for manual approval!',
            payment
        });
    }
    catch (error) {
        next(error);
    }
};
// ================= ATTENDANCE HISTORY =================
exports.getAttendanceHistory = async (req, res, next) => {
    try {
        const attendance = await Attendance.find({ memberId: req.user._id }).sort({ checkIn: -1 });
        res.json({ success: true, attendance });
    }
    catch (error) {
        next(error);
    }
};
// ================= WORKOUT & DIET PLANS =================
exports.getWorkoutPlan = async (req, res, next) => {
    try {
        const workoutPlan = await WorkoutPlan.findOne({ memberId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, workoutPlan });
    }
    catch (error) {
        next(error);
    }
};
exports.getDietPlan = async (req, res, next) => {
    try {
        const dietPlan = await DietPlan.findOne({ memberId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, dietPlan });
    }
    catch (error) {
        next(error);
    }
};
// ================= PROGRESS METRIC LOGS CRUD =================
exports.getProgressLogs = async (req, res, next) => {
    try {
        const logs = await ProgressLog.find({ memberId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, logs });
    }
    catch (error) {
        next(error);
    }
};
exports.createProgressLog = async (req, res, next) => {
    try {
        const { weight, chest, waist, arms, beforePhoto, afterPhoto, notes } = req.body;
        if (!req.user.gymId) {
            res.status(400);
            throw new Error('Please join a gym before tracking progress');
        }
        const log = await ProgressLog.create({
            gymId: req.user.gymId,
            memberId: req.user._id,
            weight,
            chest: chest || 0,
            waist: waist || 0,
            arms: arms || 0,
            beforePhoto: beforePhoto || '',
            afterPhoto: afterPhoto || '',
            notes: notes || ''
        });
        res.status(201).json({ success: true, log });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProgressLog = async (req, res, next) => {
    try {
        const log = await ProgressLog.findOneAndDelete({ _id: req.params.id, memberId: req.user._id });
        if (!log) {
            res.status(404);
            throw new Error('Progress log not found');
        }
        res.json({ success: true, message: 'Log entry deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
// ================= ANNOUNCEMENTS =================
exports.getAnnouncements = async (req, res, next) => {
    try {
        if (!req.user.gymId) {
            return res.json({ success: true, announcements: [] });
        }
        const announcements = await Announcement.find({
            gymId: req.user.gymId,
            $or: [{ targetRole: 'all' }, { targetRole: 'member' }]
        }).sort({ createdAt: -1 });
        res.json({ success: true, announcements });
    }
    catch (error) {
        next(error);
    }
};
