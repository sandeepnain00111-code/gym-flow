"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createSubscriptionPlanSchema, updateSubscriptionPlanSchema } = require('../validators/adminValidators');
const { getDashboardStats, getOwners, approveOwner, rejectOwner, blockOwner, getGyms, getMembers, getPayments, getReports, getSubscriptionPlans, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } = require('../controllers/adminController');
// All routes require protection and super_admin access
router.use(protect, authorize('super_admin'));
router.get('/dashboard', getDashboardStats);
router.get('/owners', getOwners);
router.patch('/owners/:id/approve', approveOwner);
router.patch('/owners/:id/reject', rejectOwner);
router.patch('/owners/:id/block', blockOwner);
router.get('/gyms', getGyms);
router.get('/members', getMembers);
router.get('/payments', getPayments);
router.get('/reports', getReports);
// Subscription plans CRUD
router.route('/subscription-plans')
    .get(getSubscriptionPlans)
    .post(validate(createSubscriptionPlanSchema), createSubscriptionPlan);
router.route('/subscription-plans/:id')
    .put(validate(updateSubscriptionPlanSchema), updateSubscriptionPlan)
    .delete(deleteSubscriptionPlan);
module.exports = router;
