"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { saveGymProfileSchema, createPlanSchema, updatePlanSchema, createTrainerSchema, updateTrainerSchema, createWorkoutPlanSchema, updateWorkoutPlanSchema, createDietPlanSchema, updateDietPlanSchema, createAnnouncementSchema, updateAnnouncementSchema, createManualPaymentSchema, updateDemoBookingStatusSchema } = require('../validators/ownerValidators');
const { getDashboardStats, getGymProfile, saveGymProfile, generateQR, getPlans, createPlan, updatePlan, deletePlan, getMembers, getJoinRequests, approveJoinRequest, rejectJoinRequest, getTrainers, createTrainer, updateTrainer, deleteTrainer, getWorkoutPlans, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan, getDietPlans, createDietPlan, updateDietPlan, deleteDietPlan, getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, getPayments, approvePayment, createManualPayment, getAttendance, getReports, getDemoBookings, updateDemoBookingStatus } = require('../controllers/ownerController');
// All routes require protection and gym_owner access
router.use(protect, authorize('gym_owner'));
router.get('/dashboard', getDashboardStats);
// Gym profile routes
router.route('/gym')
    .get(getGymProfile)
    .post(validate(saveGymProfileSchema), saveGymProfile);
router.post('/gym/generate-qr', generateQR);
// Gym Plans
router.route('/plans')
    .get(getPlans)
    .post(validate(createPlanSchema), createPlan);
router.route('/plans/:id')
    .put(validate(updatePlanSchema), updatePlan)
    .delete(deletePlan);
// Member list & Join Requests
router.get('/members', getMembers);
router.get('/join-requests', getJoinRequests);
router.patch('/join-requests/:id/approve', approveJoinRequest);
router.patch('/join-requests/:id/reject', rejectJoinRequest);
// Trainers
router.route('/trainers')
    .get(getTrainers)
    .post(validate(createTrainerSchema), createTrainer);
router.route('/trainers/:id')
    .put(validate(updateTrainerSchema), updateTrainer)
    .delete(deleteTrainer);
// Workout Plans
router.route('/workout-plans')
    .get(getWorkoutPlans)
    .post(validate(createWorkoutPlanSchema), createWorkoutPlan);
router.route('/workout-plans/:id')
    .put(validate(updateWorkoutPlanSchema), updateWorkoutPlan)
    .delete(deleteWorkoutPlan);
// Diet Plans
router.route('/diet-plans')
    .get(getDietPlans)
    .post(validate(createDietPlanSchema), createDietPlan);
router.route('/diet-plans/:id')
    .put(validate(updateDietPlanSchema), updateDietPlan)
    .delete(deleteDietPlan);
// Announcements
router.route('/announcements')
    .get(getAnnouncements)
    .post(validate(createAnnouncementSchema), createAnnouncement);
router.route('/announcements/:id')
    .put(validate(updateAnnouncementSchema), updateAnnouncement)
    .delete(deleteAnnouncement);
// Payments & fees
router.get('/payments', getPayments);
router.post('/payment/manual', validate(createManualPaymentSchema), createManualPayment);
router.patch('/payments/:id/approve', approvePayment);
// Attendance & Reports
router.get('/attendance', getAttendance);
router.get('/reports', getReports);
// Demo Leads
router.get('/demo-bookings', getDemoBookings);
router.patch('/demo-bookings/:id', validate(updateDemoBookingStatusSchema), updateDemoBookingStatus);
module.exports = router;
